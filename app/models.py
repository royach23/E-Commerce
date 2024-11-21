from sqlalchemy import String, Integer, Column
from database import Base

class User (Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    username = Column (String, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column (String)
    last_name = Column(String)
    address = Column (String)
    phone_number = Column(String)