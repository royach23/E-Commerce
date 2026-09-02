from pydantic import BaseModel, Field
from datetime import datetime
import pytz
from ..enums.orderStatus import OrderStatus

class Transactions(BaseModel):
    user_id: str
    total_price: float
    order_status: OrderStatus
    purchase_time: str = Field(default_factory=datetime.now(pytz.timezone('Israel')).isoformat)

