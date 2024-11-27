from pydantic import BaseModel
from ..enums.category import Category
from ..enums.size import Size
from typing import List

class Products(BaseModel):
    product_id: int
    name: str
    description: str
    price: float
    in_stock: bool
    category: Category
    sizes: List[Size]
    image: str

    def __init__(self, **data):
        super().__init__(**data)