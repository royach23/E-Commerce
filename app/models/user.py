from sqlalchemy import String, Integer, Column
from app.utils.database import Base
from sqlalchemy.orm import relationship

class User (Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    username = Column (String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    first_name = Column (String, nullable=False)
    last_name = Column(String, nullable=False)
    address = Column (String, nullable=False)
    phone_number = Column(String, nullable=False)
    email = Column(String, nullable=False)
    transactions = relationship("Transaction", backref="users")
    