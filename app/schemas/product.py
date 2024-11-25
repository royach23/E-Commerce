from pydantic import BaseModel

class Products(BaseModel):
    name: str
    description: str
    price: float
    quantity_in_stock: int
    category: str

    def __init__(self, **data):
        super().__init__(**data)