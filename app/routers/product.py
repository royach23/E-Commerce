from typing import List
from fastapi import APIRouter
from ..crud import product as productCrud
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.database import get_db, engine
from ..schemas.product import Products
from ..models import product as productModel

router = APIRouter()

productModel.Base.metadata.create_all(bind= engine)

path = '/product'

@router.get('/products', tags=['products'], response_model=List[Products])
def getAllProducts(db: Session = Depends(get_db)):
    return productCrud.getAllProducts(db)

@router.post(path, tags=['products'])
def createProduct(product: Products, db: Session = Depends (get_db)):
    return productCrud.createProduct(product, db)

@router.delete(path + "/{product_id}", tags=['products'])
def delete(product_id:int, db: Session = Depends(get_db)):
    return productCrud.deleteProduct(product_id, db)

@router.put(path + "/{product_id}", tags=['products'])
def update(product_id:int, product: Products, db: Session = Depends(get_db)):
    return productCrud.update(product_id, product, db)