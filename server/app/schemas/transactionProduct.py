from pydantic import BaseModel
from ..enums.size import Size

class TransactionProducts(BaseModel):
    transaction_id: int
    product_id: int
    quantity: int
    size: Size