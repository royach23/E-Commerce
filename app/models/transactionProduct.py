from sqlalchemy import Integer, Column, ForeignKey
from app.utils.database import Base
from sqlalchemy.orm import relationship

class TransactionProduct (Base):
    __tablename__ = 'transaction_products'
    transaction_id = Column(Integer, ForeignKey("transactions.transaction_id"), primary_key=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), primary_key=True, nullable=False)
    quantity = Column(Integer)
    product = relationship("Product", backref="transaction_products")