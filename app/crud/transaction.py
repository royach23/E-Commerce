from ..models.transaction import Transaction
from ..models.transactionProduct import TransactionProduct
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import joinedload

def getTransaction(transaction_id: int, db):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).options(joinedload(Transaction.transaction_products).joinedload(TransactionProduct.product))
    result = transaction.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'transaction with such id: {transaction_id} does not exist')
    return transaction.first()

def getUserTransactions(user_id: int, db):
    transaction = db.query(Transaction).filter(Transaction.user_id == user_id).options(joinedload(Transaction.transaction_products).joinedload(TransactionProduct.product))
    return transaction.all()

async def createTransaction(transaction, db):
    new_transaction = Transaction(**transaction.dict())
    await db.add(new_transaction)
    await db.commit()
    await db.refresh(new_transaction)
    return new_transaction

async def deleteTransaction(transaction_id: int, db):
    delete_transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id)
    delete_transaction_result = delete_transaction.first()
    if delete_transaction_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"transaction with such id does not exist")
    else:
        delete_transaction.delete(synchronize_session=False)
        await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update(transaction_id: int, transaction, db):
    updated_transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id)
    updated_transaction.first()
    if updated_transaction == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'transaction with such id: {id} does not exist')
    else:
        updated_transaction.update(transaction.dict(), synchronize_session=False)
        await db.commit()
    return updated_transaction.first()