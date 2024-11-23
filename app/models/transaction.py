from sqlalchemy import Integer, Column, Double, ForeignKey, DateTime
from app.utils.database import Base

class Transaction (Base):
    __tablename__ = 'transactions'
    transaction_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    total_price = Column(Double, nullable=False)
    purchase_time = Column(DateTime, nullable=False)