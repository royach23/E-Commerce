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
async def getUserTransactions(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return await transactionCrud.getUserTransactions(user_id, db)

@router.post(path, tags=['users'])
async def createUser(user: Users, db: Session = Depends (get_db)):
    return await userCrud.createUser(user, db)

@router.post("/login", tags=['users'])
async def login(user: LoginUsers, db: Session = Depends(get_db)):
    return await userCrud.authenticateUser(user, db)

@router.post(path + "/verify", tags=['users'])
async def login(db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return await userCrud.verifyUser(current_user, db)

@router.delete(path + "/{user_id}", tags=['users'])
async def delete(user_id:int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return await userCrud.deleteUser(user_id, current_user, db)

@router.put(path + "/{user_id}", tags=['users'])
async def update(user_id:int, current_user: dict = Depends(userCrud.get_current_user), db: Session = Depends(get_db)):
    return await userCrud.update(user_id, current_user, db)