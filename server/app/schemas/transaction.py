from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import pytz
from ..enums.orderStatus import OrderStatus

class Transactions(BaseModel):
    user_id: str
    total_price: float
    order_status: OrderStatus
    address: Optional[str] = None
    purchase_time: str = Field(default_factory=lambda: datetime.now(pytz.timezone('Israel')).isoformat())


class TransactionStatusUpdate(BaseModel):
    order_status: OrderStatus


