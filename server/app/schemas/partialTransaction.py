from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import pytz

class PartialTransactions(BaseModel):
    user_id: str
    total_price: float
    address: Optional[str] = None
    purchase_time: str = Field(default_factory=lambda: datetime.now(pytz.timezone('Israel')).isoformat())



