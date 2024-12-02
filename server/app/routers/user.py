from fastapi import APIRouter
from ..crud import user as userCrud, transaction as transactionCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from ..utils.database import get_db, engine
from ..schemas.user import Users
from ..schemas.loginUser import LoginUsers
from ..models import user as userModel
from ..utils.logger import logger

router = APIRouter()

userModel.Base.metadata.create_all(bind= engine)

path = '/user'

@router.get(path + "/{user_id}/transactions", tags=['users'])
async def getUserTransactions(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionCrud.getUserTransactions(user_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path, tags=['users'])
async def createUser(user: Users, db: Session = Depends (get_db)):
    try:
        return await userCrud.createUser(user, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post("/login", tags=['users'])
async def login(user: LoginUsers, db: Session = Depends(get_db)):
    try:
        return await userCrud.authenticateUser(user, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path + "/verify", tags=['users'])
async def login(db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await userCrud.verifyUser(current_user, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{user_id}", tags=['users'])
async def delete(user_id:int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await userCrud.deleteUser(user_id, current_user, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{user_id}", tags=['users'])
async def update(user_id:int, user: Users, current_user: dict = Depends(userCrud.get_current_user), db: Session = Depends(get_db)):
    try:
        return await userCrud.update(user_id, user, current_user, db)
    except Exception as e:
        logger.error(e)
        raise e