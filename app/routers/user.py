from fastapi import APIRouter
from ..crud import user as userCrud, transaction as transactionCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.user import Users
from ..schemas.loginUser import LoginUsers
from ..models import user as userModel

router = APIRouter()

userModel.Base.metadata.create_all(bind= engine)

path = '/user'

@router.get(path + "/{user_id}/transactions", tags=['users'])
def getUserTransactions(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionCrud.getUserTransactions(user_id, db)

@router.post(path, tags=['users'])
def createUser(user: Users, db: Session = Depends (get_db)):
    return userCrud.createUser(user, db)

@router.post("/login", tags=['users'])
def login(user: LoginUsers, db: Session = Depends(get_db)):
    return userCrud.authenticate_user(user, db)

@router.delete(path + "/{user_id}", tags=['users'])
def delete(user_id:int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return userCrud.deleteUser(user_id, db)

@router.put(path + "/{user_id}", tags=['users'])
def update(user_id:int, current_user: dict = Depends(userCrud.get_current_user), db: Session = Depends(get_db)):
    return userCrud.update(user_id, current_user, db)