from urllib.parse import unquote
from typing import Optional
from sqlalchemy import text
from ..schemas.user import Users
from ..models.user import User
from ..models.userDetails import UserDetails
from ..models.transaction import Transaction
from ..models.transactionProduct import TransactionProduct
from fastapi import HTTPException, status, Response, Depends
from fastapi.security import OAuth2PasswordBearer
from ..utils import auth0
from ..utils.logger import logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = auth0.verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

async def sync_or_create_user(current_user: dict, db, profile_data: Optional[Users] = None):
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing sub"
        )

    # Extract profile details from optional client payload or token claims
    candidate_email = (
        (profile_data.email.strip() if profile_data and profile_data.email else None)
        or current_user.get("email")
        or current_user.get("https://ecommerce.com/email")
    )
    first_name = (
        (profile_data.first_name.strip() if profile_data and profile_data.first_name else None)
        or current_user.get("given_name")
    )
    last_name = (
        (profile_data.last_name.strip() if profile_data and profile_data.last_name else None)
        or current_user.get("family_name")
    )
    username = (
        (profile_data.username.strip() if profile_data and profile_data.username else None)
        or current_user.get("nickname")
        or current_user.get("name")
    )

    fallback_email = f"{user_id.replace('|', '_')}@auth0.user"
    email = candidate_email or fallback_email
    if not username:
        username = email.split("@")[0]

    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        # Check if user existed with this email under a legacy ID (only for non-fallback emails)
        existing_email_user = None
        if candidate_email:
            existing_email_user = db.query(User).filter(User.email == candidate_email).first()

        if existing_email_user:
            old_id = existing_email_user.user_id
            if old_id != user_id:
                # Update user_id in database using raw SQL; Postgres ON UPDATE CASCADE handles transactions
                db.execute(
                    text("UPDATE users SET user_id = :new_id WHERE user_id = :old_id"),
                    {"new_id": user_id, "old_id": old_id}
                )
                db.commit()
            db_user = db.query(User).filter(User.user_id == user_id).first()
        else:
            db_user = User(
                user_id=user_id,
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                address=None,
                phone_number=None
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
    else:
        # User already exists in DB: repair placeholder email or missing names if new data is available
        updated = False
        if candidate_email and db_user.email != candidate_email:
            if not db_user.email or db_user.email.endswith("@auth0.user"):
                conflict = db.query(User).filter(User.email == candidate_email, User.user_id != user_id).first()
                if not conflict:
                    db_user.email = candidate_email
                    updated = True
        if not db_user.first_name and first_name:
            db_user.first_name = first_name
            updated = True
        if not db_user.last_name and last_name:
            db_user.last_name = last_name
            updated = True
        if not db_user.username and username:
            db_user.username = username
            updated = True
        if updated:
            db.commit()
            db.refresh(db_user)

    authenticated_user = UserDetails(
        user_id=db_user.user_id,
        username=db_user.username or "",
        first_name=db_user.first_name or "",
        last_name=db_user.last_name or "",
        address=db_user.address or "",
        phone_number=db_user.phone_number or "",
        email=db_user.email or ""
    )
    return {"user": authenticated_user}

async def verifyUser(current_user: dict, db, profile_data: Optional[Users] = None):
    return await sync_or_create_user(current_user, db, profile_data)

async def deleteUser(user_id: str, current_user: dict, db):
    decoded_user_id = unquote(user_id)
    caller_sub = current_user.get("sub")
    caller_email = current_user.get("email")

    delete_user_query = db.query(User).filter(
        (User.user_id == user_id) | 
        (User.user_id == decoded_user_id) |
        (User.email == caller_email)
    )
    delete_user_result = delete_user_query.first()
    if delete_user_result is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    # Enforce authorization: only the account owner can delete their account
    if caller_sub and delete_user_result.user_id != caller_sub and (not caller_email or delete_user_result.email != caller_email):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: cannot delete another user")
    
    target_id = delete_user_result.user_id
    transactions = db.query(Transaction).filter(Transaction.user_id == target_id).all()
    for tx in transactions:
        db.query(TransactionProduct).filter(TransactionProduct.transaction_id == tx.transaction_id).delete(synchronize_session=False)
        db.delete(tx)

    db.query(User).filter(User.user_id == target_id).delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

async def update(user_id: str, user: Users, authorized_user: dict, db):
    decoded_user_id = unquote(user_id)
    caller_sub = authorized_user.get("sub")
    caller_email = authorized_user.get("email")

    db_user = db.query(User).filter(
        (User.user_id == user_id) | 
        (User.user_id == decoded_user_id) |
        (User.email == caller_email)
    ).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {user_id} does not exist")
    
    # Enforce authorization: only the account owner can update their details
    if caller_sub and db_user.user_id != caller_sub and (not caller_email or db_user.email != caller_email):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: cannot modify another user")

    if user.first_name is not None:
        db_user.first_name = user.first_name
    if user.last_name is not None:
        db_user.last_name = user.last_name
    if user.address is not None:
        db_user.address = user.address
    if user.phone_number is not None:
        db_user.phone_number = user.phone_number
    if user.username is not None:
        db_user.username = user.username
    if user.email is not None and user.email.strip() and user.email != db_user.email:
        conflict = db.query(User).filter(User.email == user.email, User.user_id != db_user.user_id).first()
        if conflict:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")
        db_user.email = user.email

    db.commit()
    db.refresh(db_user)

    return UserDetails(
        user_id=db_user.user_id,
        username=db_user.username or "",
        first_name=db_user.first_name or "",
        last_name=db_user.last_name or "",
        address=db_user.address or "",
        phone_number=db_user.phone_number or "",
        email=db_user.email or ""
    )