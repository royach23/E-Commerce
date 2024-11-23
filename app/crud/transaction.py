import models.transaction
from fastapi import HTTPException, status, Response

def getTransaction(transaction_id: int, db):
    transaction = db.query(models.transaction.Transaction).filter(models.transaction.Transaction.transaction_id == transaction_id)
    transaction.first()
    if transaction == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'transaction with such id: {id} does not exist')
    return transaction.first()

def createTransaction(transaction, db):
    new_transaction = models.transaction.Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

def deleteTransaction(transaction_id: int, db):
    delete_transaction = db.query(models.transaction.Transaction).filter(models.transaction.Transaction.transaction_id == transaction_id)
    delete_transaction_result = delete_transaction.first()
    if delete_transaction_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"transaction with such id does not exist")
    else:
        delete_transaction.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def update(transaction_id: int, transaction, db):
    updated_transaction = db.query(models.transaction.Transaction).filter(models.transaction.Transaction.transaction_id == transaction_id)
    updated_transaction.first()
    if updated_transaction == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'transaction with such id: {id} does not exist')
    else:
        updated_transaction.update(transaction.dict(), synchronize_session=False)
        db.commit()
    return updated_transaction.first()