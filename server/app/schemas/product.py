from typing import List, Optional
from pydantic import BaseModel
from ..enums.category import Category
from ..enums.size import Size

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    in_stock: bool = True
    category: Category
    sizes: List[Size]
    image: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    in_stock: Optional[bool] = None
    category: Optional[Category] = None
    sizes: Optional[List[Size]] = None
    image: Optional[str] = None

class Products(BaseModel):
    product_id: Optional[int] = None
    name: str
    description: str
    price: float
    in_stock: bool
    category: Category
    sizes: List[Size]
    image: str