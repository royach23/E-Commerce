from sqlalchemy import Integer, Column, Double, ForeignKey, DateTime
from app.utils.database import Base

class TransactionProduct (Base):
    __tablename__ = 'transaction_products'
    transaction_id = Column(Integer, ForeignKey("transactions.transaction_id"), primary_key=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), primary_key=True, nullable=False)
    quantity = Column(Integer)