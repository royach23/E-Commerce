from fastapi import APIRouter
from ..crud import transaction as transactionCrud, transactionProduct as transactionProductCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.transaction import Transactions
from ..schemas.partialTransactionProduct import PartialTransactionProducts
from ..schemas.transactionProduct import TransactionProducts
from ..models import transaction as transactionModel
from ..crud import user as userCrud

router = APIRouter()

transactionModel.Base.metadata.create_all(bind= engine)

path = '/transaction'

@router.get(path + "/{transaction_id}", tags=['transactions'])
def getTransaction(transaction_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionCrud.getTransaction(transaction_id, db)

@router.get(path + "/{transaction_id}/products", tags=['transactions'])
def getTransactionProducts(transaction_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionProductCrud.getTransactionProducts(transaction_id, db)

@router.get(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
def getTransactionProduct(transaction_id: int, product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionProductCrud.getTransactionProductById(transaction_id, product_id, db)

@router.post(path, tags=['transactions'])
def createTransaction(transaction: Transactions, db: Session = Depends (get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionCrud.createTransaction(transaction, db)

@router.post(path + "/{transaction_id}/product", tags=['transactions'])
def createTransactionProduct(transaction_id: int, partialTransactionProduct: PartialTransactionProducts, db: Session = Depends (get_db), current_user: dict = Depends(userCrud.get_current_user)):
    transactionProduct = TransactionProducts(transaction_id=transaction_id, product_id=partialTransactionProduct.product_id, quantity=partialTransactionProduct.quantity)
    return transactionProductCrud.createTransactionProduct(transactionProduct, db)

@router.delete(path + "/{transaction_id}", tags=['transactions'])
def delete(transaction_id:int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionCrud.deleteTransaction(transaction_id, db)

@router.delete(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
def delete(transaction_id:int,  product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionProductCrud.deleteTransactionProduct(transaction_id, product_id, db)

@router.put(path + "/{transaction_id}", tags=['transactions'])
def update(transaction_id:int, transaction: Transactions, db: Session = Depends(get_db), current_user: dict = Depends(userCrud.get_current_user)):
    return transactionCrud.update(transaction_id, transaction, db)