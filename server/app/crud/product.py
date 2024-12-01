from ..models.product import Product
from fastapi import HTTPException, status, Response
from ..utils import redis
import json

async def getAllProducts(db):
    if not redis.redis_client:
        raise HTTPException(status_code=500, detail="Redis connection is not established.")
    
    cached_products = redis.redis_client.get("all_products")
    if cached_products:
        products_dicts = json.loads(cached_products)
        return [Product.from_dict(product) for product in products_dicts]
    
    products = db.query(Product).all()
    if not products:
        raise HTTPException(status_code=404, detail="no products")
    
    products_data = [product.to_dict() for product in products]
    redis.redis_client.setex("all_products", 60, json.dumps(products_data))
    return products

async def searchProducts(search_term, db):
    if not redis.redis_client:
        raise HTTPException(status_code=500, detail="Redis connection is not established.")
    
    cached_products = redis.redis_client.get(search_term)
    if cached_products:
        products_dicts = json.loads(cached_products)
        return [Product.from_dict(product) for product in products_dicts]
    
    products = db.query(Product).filter(Product.name.ilike(f"%{search_term}%")).all()
    if not products:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    products_data = [product.to_dict() for product in products]
    redis.redis_client.setex(search_term, 60, json.dumps(products_data))
    return products

async def createProduct(product, db):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

async def deleteProduct(product_id: int, db):
    delete_product = db.query(Product).filter(Product.product_id == product_id)
    delete_product_result = delete_product.first()
    if delete_product_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"product with such id does not exist")
    else:
        delete_product.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update(product_id: int, product, db):
    updated_product = db.query(Product).filter(Product.product_id == product_id)
    result = updated_product.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'product with such id: {product_id} does not exist')
    else:
        updated_product.update(product.dict(), synchronize_session=False)
        db.commit()
    return updated_product.first()