from pydantic import BaseModel
from ..enums.size import Size

class PartialTransactionProducts(BaseModel):
    product_id: int
    quantity: int
    size: Size
