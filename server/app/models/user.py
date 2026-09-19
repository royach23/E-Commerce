from sqlalchemy import String, Column
from app.utils.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    user_id = Column(String, primary_key=True, nullable=False)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    transactions = relationship("Transaction", backref="users")



    