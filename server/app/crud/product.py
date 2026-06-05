from ..models.product import Product
from fastapi import HTTPException, status, Response
from ..utils import redis
import json
import logging

logger = logging.getLogger(__name__)

def get_from_cache(key):
    try:
        if redis.redis_client:
            data = redis.redis_client.get(key)
            return json.loads(data) if data else None
    except Exception as e:
        logger.error(f"Redis error during get: {e}")
    return None

def set_to_cache(key, value, expiry=60):
    try:
        if redis.redis_client:
            redis.redis_client.setex(key, expiry, json.dumps(value))
    except Exception as e:
        logger.error(f"Redis error during set: {e}")

def invalidate_product_caches():
    try:
        if redis.redis_client:
            redis.redis_client.delete("all_products")
    except Exception as e:
        logger.error(f"Redis error during delete: {e}")

async def getAllProducts(db):
    cached_products = get_from_cache("all_products")
    if cached_products:
        return [Product.from_dict(product) for product in cached_products]
    
    products = db.query(Product).all()
    if not products:
        raise HTTPException(status_code=404, detail="no products")
    
    products_data = [product.to_dict() for product in products]
    set_to_cache("all_products", products_data)
    return products

async def searchProducts(search_term, db):
    cached_products = get_from_cache(f"search:{search_term}")
    if cached_products:
        return [Product.from_dict(product) for product in cached_products]
    
    products = db.query(Product).filter(Product.name.ilike(f"%{search_term}%")).all()
    if not products:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    products_data = [product.to_dict() for product in products]
    set_to_cache(f"search:{search_term}", products_data)
    return products

async def createProduct(product, db):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    invalidate_product_caches()
    return new_product

async def deleteProduct(product_id: int, db):
    delete_product = db.query(Product).filter(Product.product_id == product_id)
    delete_product_result = delete_product.first()
    if delete_product_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"product with such id does not exist")
    else:
        delete_product.delete(synchronize_session=False)
        db.commit()
    invalidate_product_caches()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update(product_id: int, product, db):
    updated_product = db.query(Product).filter(Product.product_id == product_id)
    result = updated_product.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'product with such id: {product_id} does not exist')
    else:
        updated_product.update(product.dict(), synchronize_session=False)
        db.commit()
    invalidate_product_caches()
    return updated_product.first()