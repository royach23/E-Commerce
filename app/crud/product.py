from models.product import Product
from fastapi import HTTPException, status, Response

def getAllProducts(db):
    all_products = db.query(Product).all()
    return all_products

def createProduct(product, db):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

def deleteProduct(product_id: int, db):
    delete_product = db.query(Product).filter(Product.product_id == product_id)
    delete_product_result = delete_product.first()
    if delete_product_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"product with such id does not exist")
    else:
        delete_product.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def update(product_id: int, product, db):
    updated_product = db.query(Product).filter(Product.product_id == product_id)
    result = updated_product.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'product with such id: {product_id} does not exist')
    else:
        updated_product.update(product.dict(), synchronize_session=False)
        db.commit()
    return updated_product.first()