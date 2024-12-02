from fastapi import APIRouter
from ..schemas.partialTransaction import PartialTransactions
from ..crud import transaction as transactionCrud, transactionProduct as transactionProductCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.transaction import Transactions
from ..schemas.partialTransactionProduct import PartialTransactionProducts
from ..schemas.transactionProduct import TransactionProducts
from ..models import transaction as transactionModel
from ..crud import user as userCrud
from ..utils.logger import logger

router = APIRouter()

transactionModel.Base.metadata.create_all(bind= engine)

path = '/transaction'

@router.get(path + "/{transaction_id}", tags=['transactions'])
async def getTransaction(transaction_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionCrud.getTransaction(transaction_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + "/{transaction_id}/products", tags=['transactions'])
async def getTransactionProducts(transaction_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionProductCrud.getTransactionProducts(transaction_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
async def getTransactionProduct(transaction_id: int, product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionProductCrud.getTransactionProductById(transaction_id, product_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path, tags=['transactions'])
async def createTransaction(transaction: PartialTransactions, db: Session = Depends (get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionCrud.createTransaction(transaction, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path + "/{transaction_id}/product", tags=['transactions'])
async def createTransactionProduct(transaction_id: int, partialTransactionProduct: PartialTransactionProducts, db: Session = Depends (get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        transactionProduct = TransactionProducts(transaction_id=transaction_id, product_id=partialTransactionProduct.product_id, quantity=partialTransactionProduct.quantity, size=partialTransactionProduct.size)
        return await transactionProductCrud.createTransactionProduct(transactionProduct, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{transaction_id}", tags=['transactions'])
async def delete(transaction_id:int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionCrud.deleteTransaction(transaction_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
async def delete(transaction_id:int,  product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionProductCrud.deleteTransactionProduct(transaction_id, product_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{transaction_id}", tags=['transactions'])
async def update(transaction_id:int, transaction: Transactions, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    try:
        return await transactionCrud.update(transaction_id, transaction, db)
    except Exception as e:
        logger.error(e)
        raise e