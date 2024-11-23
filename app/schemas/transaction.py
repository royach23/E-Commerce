from pydantic import BaseModel, Field
from datetime import datetime, timezone

class Transactions(BaseModel):
    user_id: int
    total_price: float
    purchase_time: str = Field(default_factory=datetime.now(timezone.utc).isoformat)
