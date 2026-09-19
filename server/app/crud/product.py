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

async def getProductById(product_id: int, db):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with id {product_id} not found")
    return product

async def createProduct(product, db):
    product_data = product.dict(exclude_unset=True) if hasattr(product, 'dict') else dict(product)
    # Ensure auto-incrementing ID is not overridden by None
    if "product_id" in product_data and product_data["product_id"] is None:
        del product_data["product_id"]
    new_product = Product(**product_data)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    invalidate_product_caches()
    return new_product

async def deleteProduct(product_id: int, db):
    product_query = db.query(Product).filter(Product.product_id == product_id)
    product_result = product_query.first()
    if product_result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product with such id does not exist")
    
    try:
        product_query.delete(synchronize_session=False)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Could not delete product {product_id} due to database constraint: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot delete product because it is part of existing customer order history. Please mark it as Out of Stock instead."
        )
    
    invalidate_product_caches()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

async def update(product_id: int, product, db):
    query = db.query(Product).filter(Product.product_id == product_id)
    existing = query.first()
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Product with id {product_id} does not exist')
    
    update_data = product.dict(exclude_unset=True) if hasattr(product, 'dict') else dict(product)
    update_data.pop("product_id", None)
    
    for key, value in update_data.items():
        setattr(existing, key, value)
        
    db.commit()
    db.refresh(existing)
    invalidate_product_caches()
    return existing