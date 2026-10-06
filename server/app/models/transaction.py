from sqlalchemy import Integer, String, Column, Double, ForeignKey, DateTime, Enum, text
from app.utils.database import Base, engine
from sqlalchemy.orm import relationship
from ..enums.orderStatus import OrderStatus

class Transaction (Base):
    __tablename__ = 'transactions'
    transaction_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    total_price = Column(Double, nullable=False)
    purchase_time = Column(DateTime, nullable=False)
    order_status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    address = Column(String, nullable=True)
    transaction_products = relationship("TransactionProduct", backref="transactions")

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS address VARCHAR;"))
        conn.commit()
except Exception:
    pass



