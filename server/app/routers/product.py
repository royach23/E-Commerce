from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..crud import product as productCrud, user as userCrud
from sqlalchemy.orm import Session
from app.utils.database import get_db, engine
from ..schemas.product import Products, ProductCreate, ProductUpdate
from ..models import product as productModel
from ..utils.logger import logger

router = APIRouter()

productModel.Base.metadata.create_all(bind=engine)

path = '/product'

@router.get('/products', tags=['products'], response_model=List[Products])
async def getAllProducts(db: Session = Depends(get_db)):
    try:
        return await productCrud.getAllProducts(db)
    except Exception as e:
        logger.error(e)
        raise e

@router.get(path + '/{product_id}', tags=['products'], response_model=Products)
async def getProductById(product_id: int, db: Session = Depends(get_db)):
    try:
        return await productCrud.getProductById(product_id, db)
    except HTTPException:
        raise
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

@router.post(path, tags=['products'], response_model=Products, status_code=status.HTTP_201_CREATED)
async def createProduct(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(userCrud.get_current_admin_user)
):
    try:
        return await productCrud.createProduct(product, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.delete(path + "/{product_id}", tags=['products'])
async def delete(
    product_id: int, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(userCrud.get_current_admin_user)
):
    try:
        return await productCrud.deleteProduct(product_id, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e

@router.put(path + "/{product_id}", tags=['products'], response_model=Products)
async def update(
    product_id: int, 
    product: ProductUpdate, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(userCrud.get_current_admin_user)
):
    try:
        return await productCrud.update(product_id, product, db)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(e)
        raise e