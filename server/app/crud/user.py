from ..schemas.user import Users
from ..models.user import User
from ..models.userDetails import UserDetails
from fastapi import HTTPException, status, Response
from ..utils import security
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def createUser(user, db):
    new_user = User(**user.dict())
    new_user.password = security.hash_password(new_user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    authenticated_user = UserDetails(
        user_id=new_user.user_id,
        username=new_user.username,
        first_name= new_user.first_name,
        last_name= new_user.last_name,
        address= new_user.address,
        phone_number= new_user.phone_number,
        email= new_user.email
    )
    access_token = security.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": authenticated_user}

async def authenticateUser(user, db):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not security.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"invalid username or password")
    authenticated_user = UserDetails(
        user_id=db_user.user_id,
        username=db_user.username,
        first_name= db_user.first_name,
        last_name= db_user.last_name,
        address= db_user.address,
        phone_number= db_user.phone_number,
        email= db_user.email
    )
    access_token = security.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": authenticated_user}

async def verifyUser(username, db):
    db_user = db.query(User).filter(User.username == username['sub']).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"invalid user details")
    authenticated_user = UserDetails(
        user_id=db_user.user_id,
        username=db_user.username,
        first_name= db_user.first_name,
        last_name= db_user.last_name,
        address= db_user.address,
        phone_number= db_user.phone_number,
        email= db_user.email
    )
    return {"user": authenticated_user}

async def deleteUser(user_id: int, current_user, db):
    delete_user = db.query(User).filter(User.user_id == user_id)
    delete_user_result = delete_user.first()
    if delete_user_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with such id does not exist")
    if delete_user_result.username != current_user['sub']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"unauthorized action")
    else:
        delete_user.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update(user_id: int, user: Users, authorized_user, db):
    updated_user = db.query(User).filter(User.user_id == user_id)
    result = updated_user.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'user with such id: {user_id} does not exist')
    if result.username != authorized_user['sub']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"unauthorized action")
    else:
        new_user_details = User(**user.model_dump())
        if new_user_details.password == 'none':
            new_user_details.password = security.hash_password(new_user_details.password)
        else:
            new_user_details.password = result.password
        
        new_user_details.user_id = user_id
        new_user_details.username = result.username
        updated_user.update({key: value for key, value in new_user_details.__dict__.items() if not key.startswith('_')}, synchronize_session=False)
        db.commit()
               
    return updated_user.first()

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = security.decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload