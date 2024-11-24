from models.transactionProduct import TransactionProduct
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import joinedload

def getTransactionProducts(transaction_id: int, db):
    transactionProducts = db.query(TransactionProduct).filter(TransactionProduct.transaction_id == transaction_id).options(joinedload(TransactionProduct.product)).all()
    if transactionProducts == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'no products for transaction with id: {id}')
    return transactionProducts

def getTransactionProductById(transaction_id: int, product_id: int, db):
    transactionProduct = db.query(TransactionProduct).filter(TransactionProduct.transaction_id == transaction_id).filter(TransactionProduct.product_id == product_id).options(joinedload(TransactionProduct.product)).first()
    if transactionProduct == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'product or transaction with such id does not exist')
    return transactionProduct

def createTransactionProduct(transactionProduct, db):
    new_transaction_product = TransactionProduct(**transactionProduct.dict())
    db.add(new_transaction_product)
    db.commit()
    db.refresh(new_transaction_product)
    return new_transaction_product

def deleteTransactionProduct(transaction_id: int, product_id: int, db):
    delete_transaction_product = db.query(TransactionProduct).filter(TransactionProduct.transaction_id == transaction_id).filter(TransactionProduct.product_id == product_id)
    delete_transaction_product_result = delete_transaction_product.first()
    if delete_transaction_product_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"product or transaction with such id does not exist")
    else:
        delete_transaction_product.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
