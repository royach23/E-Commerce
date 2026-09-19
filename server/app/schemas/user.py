from pydantic import BaseModel
from typing import Optional

class Users(BaseModel):
    user_id: Optional[str] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    username: Optional[str] = None

