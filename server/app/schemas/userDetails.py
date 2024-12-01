from pydantic import BaseModel

class UserDetails(BaseModel):
    username: str
    first_name: str
    last_name: str
    address: str
    phone_number: str
