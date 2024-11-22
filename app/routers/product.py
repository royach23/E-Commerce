from typing import List
from fastapi import APIRouter
import crud.product
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from schemas.product import Products
import models.product

router = APIRouter()

models.product.Base.metadata.create_all(bind= engine)

path = '/product'

@router.get('/products', tags=['products'], response_model=List[Products])
def getAllProducts(db: Session = Depends(get_db)):
    return crud.product.getAllProducts(db)

@router.post(path)
def createProduct(product: Products, db: Session = Depends (get_db)):
    return crud.product.createProduct(product, db)

@router.delete(path + "/{product_id}")
def delete(product_id:int, db: Session = Depends(get_db)):
    return crud.product.deleteProduct(product_id, db)

@router.put(path + "/{product_id}")
def update(product_id:int, product: Products, db: Session = Depends(get_db)):
    return crud.product.update(product_id, product, db)