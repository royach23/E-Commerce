from pydantic import BaseModel, Field
from datetime import datetime
import pytz

class PartialTransactions(BaseModel):
    user_id: str
    total_price: float
    purchase_time: str = Field(default_factory=datetime.now(pytz.timezone('Israel')).isoformat)


