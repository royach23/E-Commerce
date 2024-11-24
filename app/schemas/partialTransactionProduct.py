from pydantic import BaseModel

class PartialTransactionProducts(BaseModel):
    product_id: int
    quantity: int
