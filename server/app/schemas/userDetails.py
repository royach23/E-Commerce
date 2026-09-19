from typing import List
from pydantic import BaseModel

class UserDetails(BaseModel):
    user_id: str
    email: str
    username: str = ""
    first_name: str = ""
    last_name: str = ""
    address: str = ""
    phone_number: str = ""
    is_admin: bool = False
    roles: List[str] = []



