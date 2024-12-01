from sqlalchemy import Integer, Column, Double, ForeignKey, DateTime, Enum
from app.utils.database import Base
from sqlalchemy.orm import relationship
from ..enums.orderStatus import OrderStatus

class Transaction (Base):
    __tablename__ = 'transactions'
    transaction_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    total_price = Column(Double, nullable=False)
    purchase_time = Column(DateTime, nullable=False)
    order_status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    transaction_products = relationship("TransactionProduct", backref="transactions")

