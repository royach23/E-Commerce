from pydantic import BaseModel

class TransactionProducts(BaseModel):
    transaction_id: int
    product_id: int
    quantity: int
