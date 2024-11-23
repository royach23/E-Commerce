from typing import List
from fastapi import APIRouter
import crud.transaction
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from schemas.transaction import Transactions
import models.transaction

router = APIRouter()

models.transaction.Base.metadata.create_all(bind= engine)

path = '/transaction'

@router.get(path + "/{transaction_id}")
def getTransaction(transaction_id: int, db: Session = Depends(get_db)):
    return crud.transaction.getTransaction(transaction_id, db)

@router.post(path)
def createTransaction(transaction: Transactions, db: Session = Depends (get_db)):
    return crud.transaction.createTransaction(transaction, db)

@router.delete(path + "/{transaction_id}")
def delete(transaction_id:int, db: Session = Depends(get_db)):
    return crud.transaction.deleteTransaction(transaction_id, db)

@router.put(path + "/{transaction_id}")
def update(transaction_id:int, transaction: Transactions, db: Session = Depends(get_db)):
    return crud.transaction.update(transaction_id, transaction, db)