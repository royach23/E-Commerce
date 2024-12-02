from typing import List
from fastapi import APIRouter
from ..crud import product as productCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.product import Products
from ..models import product as productModel
from ..utils.logger import logger

router = APIRouter()

productModel.Base.metadata.create_all(bind= engine)

path = '/product'

@router.get('/products', tags=['products'], response_model=List[Products])
async def getAllProducts(db: Session = Depends(get_db)):
    try:
        return await productCrud.getAllProducts(db)
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + '/search/{search_term}', tags=['products'], response_model=List[Products])
async def searchProducts(search_term: str, db: Session = Depends(get_db)):
    try:
        return await productCrud.searchProducts(search_term, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.post(path, tags=['products'])
async def createProduct(product: Products, db: Session = Depends (get_db)):
    try:
        return await productCrud.createProduct(product, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{product_id}", tags=['products'])
async def delete(product_id:int, db: Session = Depends(get_db)):
    try:
        return await productCrud.deleteProduct(product_id, db)
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{product_id}", tags=['products'])
async def update(product_id:int, product: Products, db: Session = Depends(get_db)):
    try:
        return await productCrud.update(product_id, product, db)
    except Exception as e:
        logger.error(e)
        raise e