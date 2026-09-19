from ..enums.orderStatus import OrderStatus
from ..models.transaction import Transaction
from ..models.transactionProduct import TransactionProduct
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import joinedload
from datetime import datetime
import pytz

from ..models.user import User

async def getTransaction(transaction_id: int, db):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).options(
        joinedload(Transaction.transaction_products).joinedload(TransactionProduct.product)
    )
    result = transaction.first()
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f'Transaction with id {transaction_id} does not exist'
        )
    return result

async def getUserTransactions(user_id: str, db):
    transaction = db.query(Transaction).filter(Transaction.user_id == user_id).options(
        joinedload(Transaction.transaction_products).joinedload(TransactionProduct.product)
    )
    if not transaction:
        return []
    return transaction.all()

async def createTransaction(transaction, db):
    # Ensure user has complete contact and shipping details before placing an order
    user = db.query(User).filter(User.user_id == transaction.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {transaction.user_id} does not exist"
        )
    if not (user.first_name and user.last_name and user.phone_number and user.address):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incomplete user profile. Please provide first name, last name, phone number, and address before placing an order."
        )

    new_transaction = Transaction(**transaction.dict(), order_status=OrderStatus.PENDING.value)
    new_transaction.purchase_time = datetime.now(pytz.timezone('Israel')).isoformat()
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

async def deleteTransaction(transaction_id: int, db):
    delete_transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id)
    delete_transaction_result = delete_transaction.first()
    if delete_transaction_result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Transaction with id {transaction_id} does not exist"
        )
    delete_transaction.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

async def update(transaction_id: int, transaction, db):
    query = db.query(Transaction).filter(Transaction.transaction_id == transaction_id)
    existing = query.first()
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f'Transaction with id {transaction_id} does not exist'
        )
    update_data = transaction.dict() if hasattr(transaction, 'dict') else dict(transaction)
    query.update(update_data, synchronize_session=False)
    db.commit()
    return query.first()

async def getAllTransactions(db):
    transactions = db.query(Transaction).options(
        joinedload(Transaction.transaction_products).joinedload(TransactionProduct.product)
    ).order_by(Transaction.purchase_time.desc()).all()
    return transactions

async def updateTransactionStatus(transaction_id: int, order_status: OrderStatus, db):
    transaction = await getTransaction(transaction_id, db)
    transaction.order_status = order_status
    db.commit()
    db.refresh(transaction)
    return transaction