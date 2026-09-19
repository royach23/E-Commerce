from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.partialTransaction import PartialTransactions
from ..crud import transaction as transactionCrud, transactionProduct as transactionProductCrud
from sqlalchemy.orm import Session
from app.utils.database import get_db, engine
from ..schemas.transaction import Transactions, TransactionStatusUpdate
from ..schemas.partialTransactionProduct import PartialTransactionProducts
from ..schemas.transactionProduct import TransactionProducts
from ..models import transaction as transactionModel
from ..crud import user as userCrud
from ..utils import auth0
from ..utils.logger import logger

router = APIRouter()

transactionModel.Base.metadata.create_all(bind=engine)

path = '/transaction'

async def _verify_transaction_owner(transaction_id: int, current_user: dict, db: Session):
    tx = await transactionCrud.getTransaction(transaction_id, db)
    if auth0.is_admin_user(current_user):
        return tx
    caller_sub = current_user.get("sub")
    if caller_sub and tx.user_id != caller_sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: you do not have access to this transaction"
        )
    return tx

@router.get('/transactions', tags=['transactions'])
async def getAllTransactions(
    db: Session = Depends(get_db), 
    current_admin: dict = Depends(userCrud.get_current_admin_user)
):
    try:
        return await transactionCrud.getAllTransactions(db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e


@router.get(path + "/{transaction_id}", tags=['transactions'])
async def getTransaction(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        return await _verify_transaction_owner(transaction_id, current_user, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + "/{transaction_id}/products", tags=['transactions'])
async def getTransactionProducts(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        return await transactionProductCrud.getTransactionProducts(transaction_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
async def getTransactionProduct(
    transaction_id: int, 
    product_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        return await transactionProductCrud.getTransactionProductById(transaction_id, product_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path, tags=['transactions'])
async def createTransaction(
    transaction: PartialTransactions, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        # Enforce that the created transaction belongs to the authenticated caller
        caller_sub = current_user.get("sub")
        if caller_sub:
            transaction.user_id = caller_sub
        return await transactionCrud.createTransaction(transaction, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path + "/{transaction_id}/product", tags=['transactions'])
async def createTransactionProduct(
    transaction_id: int, 
    partialTransactionProduct: PartialTransactionProducts, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        transactionProduct = TransactionProducts(
            transaction_id=transaction_id, 
            product_id=partialTransactionProduct.product_id, 
            quantity=partialTransactionProduct.quantity, 
            size=partialTransactionProduct.size
        )
        return await transactionProductCrud.createTransactionProduct(transactionProduct, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{transaction_id}", tags=['transactions'])
async def delete(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        return await transactionCrud.deleteTransaction(transaction_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{transaction_id}/product/{product_id}", tags=['transactions'])
async def deleteProduct(
    transaction_id: int, 
    product_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        return await transactionProductCrud.deleteTransactionProduct(transaction_id, product_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{transaction_id}", tags=['transactions'])
async def update(
    transaction_id: int, 
    transaction: Transactions, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(userCrud.get_current_user)
):
    try:
        await _verify_transaction_owner(transaction_id, current_user, db)
        return await transactionCrud.update(transaction_id, transaction, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{transaction_id}/status", tags=['transactions'])
async def updateTransactionStatus(
    transaction_id: int, 
    status_payload: TransactionStatusUpdate, 
    db: Session = Depends(get_db), 
    current_admin: dict = Depends(userCrud.get_current_admin_user)
):
    try:
        return await transactionCrud.updateTransactionStatus(transaction_id, status_payload.order_status, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e