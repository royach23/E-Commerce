from pydantic import BaseModel

class LoginUsers(BaseModel):
    username: str
    password: str
