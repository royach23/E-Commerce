from pydantic import BaseModel
from ..enums.category import Category
from ..enums.size import Size

class Products(BaseModel):
    name: str
    description: str
    price: float
    in_stock: bool
    category: Category
    sizes: Size
    image: str

    def __init__(self, **data):
        super().__init__(**data)