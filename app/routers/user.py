from typing import List
from fastapi import APIRouter
import crud.user
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from schemas.user import Users
import models.user

router = APIRouter()

models.user.Base.metadata.create_all(bind= engine)

path = '/user'

@router.get('/users', tags=['users'], response_model=List[Users])
def getAllUsers(db: Session = Depends(get_db)):
    return crud.user.getAllUsers(db)

@router.post(path, tags=['users'])
def createUser(user: Users, db: Session = Depends (get_db)):
    return crud.user.createUser(user, db)

@router.delete(path + "/{user_id}", tags=['users'])
def delete(user_id:int, db: Session = Depends(get_db)):
    return crud.user.deleteUser(user_id, db)

@router.put(path + "/{user_id}", tags=['users'])
def update(user_id:int, user: Users, db: Session = Depends(get_db)):
    return crud.user.update(user_id, user, db)