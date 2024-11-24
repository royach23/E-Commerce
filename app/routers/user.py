from typing import List
from fastapi import APIRouter
from ..crud import user as userCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.user import Users
from ..schemas.userDetails import UserDetails
from ..schemas.loginUser import LoginUsers
from ..models import user as userModel

router = APIRouter()

userModel.Base.metadata.create_all(bind= engine)

path = '/user'

@router.post(path, tags=['users'])
def createUser(user: Users, db: Session = Depends (get_db)):
    return userCrud.createUser(user, db)

@router.post("/login", tags=['users'], response_model=UserDetails)
def login(user: LoginUsers, db: Session = Depends(get_db)):
    return userCrud.authenticate_user(user, db)

@router.delete(path + "/{user_id}", tags=['users'])
def delete(user_id:int, db: Session = Depends(get_db)):
    return userCrud.deleteUser(user_id, db)

@router.put(path + "/{user_id}", tags=['users'])
def update(user_id:int, user: Users, db: Session = Depends(get_db)):
    return userCrud.update(user_id, user, db)