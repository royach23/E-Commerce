from urllib.parse import unquote
from typing import Optional
from sqlalchemy import text
from ..schemas.user import Users
from ..models.user import User
from ..schemas.userDetails import UserDetails
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

def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if not auth0.is_admin_user(current_user):
        logger.warning(f"User {current_user.get('sub')} attempted admin action without admin role")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrator privileges required"
        )
    return current_user


async def sync_or_create_user(current_user: dict, db, profile_data: Optional[Users] = None):
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing sub"
        )

    email = (
        current_user.get("email")
        or current_user.get("https://ecommerce.com/email")
        or (profile_data.email.strip() if profile_data and profile_data.email else "")
        or ""
    )
    first_name = current_user.get("given_name") or (profile_data.first_name.strip() if profile_data and profile_data.first_name else "") or ""
    last_name = current_user.get("family_name") or (profile_data.last_name.strip() if profile_data and profile_data.last_name else "") or ""
    username = current_user.get("nickname") or current_user.get("name") or (profile_data.username.strip() if profile_data and profile_data.username else "") or ""

    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        db_user = User(
            user_id=user_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
            address=None,
            phone_number=None
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    else:
        updated = False
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

    user_is_admin = auth0.is_admin_user(current_user)
    user_roles = auth0.extract_user_roles(current_user)

    authenticated_user = UserDetails(
        user_id=db_user.user_id,
        username=db_user.username or username,
        first_name=db_user.first_name or first_name,
        last_name=db_user.last_name or last_name,
        address=db_user.address or "",
        phone_number=db_user.phone_number or "",
        email=email,
        is_admin=user_is_admin,
        roles=user_roles
    )
    return {"user": authenticated_user}

async def verifyUser(current_user: dict, db, profile_data: Optional[Users] = None):
    return await sync_or_create_user(current_user, db, profile_data)

async def deleteUser(user_id: str, current_user: dict, db):
    decoded_user_id = unquote(user_id)
    caller_sub = current_user.get("sub")

    delete_user_query = db.query(User).filter(
        (User.user_id == user_id) | 
        (User.user_id == decoded_user_id)
    )
    delete_user_result = delete_user_query.first()
    if delete_user_result is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    if caller_sub and delete_user_result.user_id != caller_sub:
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

    db_user = db.query(User).filter(
        (User.user_id == user_id) | 
        (User.user_id == decoded_user_id)
    ).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {user_id} does not exist")
    
    if caller_sub and db_user.user_id != caller_sub:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: cannot modify another user")

    if user.first_name is not None:
        db_user.first_name = user.first_name
    if user.last_name is not None:
        db_user.last_name = user.last_name
    if user.username is not None:
        db_user.username = user.username
    if user.address is not None:
        db_user.address = user.address
    if user.phone_number is not None:
        db_user.phone_number = user.phone_number

    db.commit()
    db.refresh(db_user)

    user_is_admin = auth0.is_admin_user(authorized_user)
    user_roles = auth0.extract_user_roles(authorized_user)

    email = (
        authorized_user.get("email")
        or authorized_user.get("https://ecommerce.com/email")
        or (user.email.strip() if user.email else "")
        or ""
    )

    return UserDetails(
        user_id=db_user.user_id,
        username=db_user.username or "",
        first_name=db_user.first_name or "",
        last_name=db_user.last_name or "",
        address=db_user.address or "",
        phone_number=db_user.phone_number or "",
        email=email,
        is_admin=user_is_admin,
        roles=user_roles
    )