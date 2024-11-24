from typing import List
from fastapi import APIRouter
import crud.transaction
import crud.transactionProduct
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from schemas.transaction import Transactions
from schemas.partialTransactionProduct import PartialTransactionProducts
from schemas.transactionProduct import TransactionProducts
import models.transaction

router = APIRouter()

models.transaction.Base.metadata.create_all(bind= engine)

path = '/transaction'

@router.get(path + "/{transaction_id}")
def getTransaction(transaction_id: int, db: Session = Depends(get_db)):
    return crud.transaction.getTransaction(transaction_id, db)

@router.get(path + "/{transaction_id}/products")
def getTransactionProducts(transaction_id: int, db: Session = Depends(get_db)):
    return crud.transactionProduct.getTransactionProducts(transaction_id, db)

@router.get(path + "/{transaction_id}/product/{product_id}")
def getTransactionProduct(transaction_id: int, product_id: int, db: Session = Depends(get_db)):
    return crud.transactionProduct.getTransactionProductById(transaction_id, product_id, db)

@router.post(path)
def createTransaction(transaction: Transactions, db: Session = Depends (get_db)):
    return crud.transaction.createTransaction(transaction, db)

@router.post(path + "/{transaction_id}/product")
def createTransactionProduct(transaction_id: int, partialTransactionProduct: PartialTransactionProducts, db: Session = Depends (get_db)):
    transactionProduct = TransactionProducts(transaction_id=transaction_id, product_id=partialTransactionProduct.product_id, quantity=partialTransactionProduct.quantity)
    return crud.transactionProduct.createTransactionProduct(transactionProduct, db)

@router.delete(path + "/{transaction_id}")
def delete(transaction_id:int, db: Session = Depends(get_db)):
    return crud.transaction.deleteTransaction(transaction_id, db)

@router.delete(path + "/{transaction_id}/product/{product_id}")
def delete(transaction_id:int,  product_id: int, db: Session = Depends(get_db)):
    return crud.transactionProduct.deleteTransactionProduct(transaction_id, product_id, db)

@router.put(path + "/{transaction_id}")
def update(transaction_id:int, transaction: Transactions, db: Session = Depends(get_db)):
    return crud.transaction.update(transaction_id, transaction, db)