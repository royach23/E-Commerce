from pydantic import BaseModel

class Users(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    address: str
    phone_number: str
    email: str
