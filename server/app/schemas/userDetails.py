from typing import Optional, List
from pydantic import BaseModel

class UserDetails(BaseModel):
    user_id: Optional[str] = None
    username: str
    first_name: str
    last_name: str
    address: str
    phone_number: str
    email: Optional[str] = None
    is_admin: bool = False
    roles: List[str] = []

