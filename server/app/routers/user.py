from typing import Optional
from urllib.parse import unquote
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..crud import user as userCrud, transaction as transactionCrud
from ..utils.database import get_db, engine
from ..schemas.user import Users
from ..models import user as userModel
from ..utils.logger import logger

router = APIRouter()

userModel.Base.metadata.create_all(bind=engine)

path = '/user'

@router.get(path + "/{user_id:path}/transactions", tags=['users'])
async def getUserTransactions(
    user_id: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        caller_sub = current_user.get("sub")
        decoded_user_id = unquote(user_id)
        if caller_sub and user_id != caller_sub and decoded_user_id != caller_sub:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Forbidden: cannot view another user's transactions"
            )
        return await transactionCrud.getUserTransactions(decoded_user_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path + "/sync", tags=['users'])
async def syncUser(
    user_data: Optional[Users] = None,
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        return await userCrud.sync_or_create_user(current_user, db, profile_data=user_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path + "/verify", tags=['users'])
async def verify(
    user_data: Optional[Users] = None,
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        return await userCrud.verifyUser(current_user, db, profile_data=user_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{user_id:path}", tags=['users'])
async def delete(
    user_id: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        return await userCrud.deleteUser(user_id, current_user, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{user_id:path}", tags=['users'])
async def update(
    user_id: str, 
    user: Users, 
    current_user: dict = Depends(userCrud.get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return await userCrud.update(user_id, user, current_user, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e