import models.transactionProduct
from fastapi import HTTPException, status, Response

def getTransactionProducts(transaction_id: int, db):
    print("(------------------------------------------------here)")
    print(transaction_id)
    transactionProducts = db.query(models.transactionProduct.TransactionProduct).filter(models.transactionProduct.TransactionProduct.transaction_id == transaction_id).all()
    if transactionProducts == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'no products for transaction with id: {id}')
    return transactionProducts

def getTransactionProductById(transaction_id: int, product_id: int, db):
    transactionProduct = db.query(models.transactionProduct.TransactionProduct).filter(models.transactionProduct.TransactionProduct.transaction_id == transaction_id).filter(models.transactionProduct.TransactionProduct.product_id == product_id).first()
    if transactionProduct == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'product or transaction with such id does not exist')
    return transactionProduct

def createTransactionProduct(transactionProduct, db):
    new_transaction_product = models.transactionProduct.TransactionProduct(**transactionProduct.dict())
    db.add(new_transaction_product)
    db.commit()
    db.refresh(new_transaction_product)
    return new_transaction_product

def deleteTransactionProduct(transaction_id: int, product_id: int, db):
    delete_transaction_product = db.query(models.transactionProduct.TransactionProduct).filter(models.transactionProduct.TransactionProduct.transaction_id == transaction_id).filter(models.transactionProduct.TransactionProduct.product_id == product_id)
    delete_transaction_product_result = delete_transaction_product.first()
    if delete_transaction_product_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"product or transaction with such id does not exist")
    else:
        delete_transaction_product.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
