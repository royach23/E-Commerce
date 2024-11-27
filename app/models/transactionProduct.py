from sqlalchemy import Integer, Column, ForeignKey, Enum
from app.utils.database import Base
from sqlalchemy.orm import relationship
from ..enums.size import Size

class TransactionProduct (Base):
    __tablename__ = 'transaction_products'
    transaction_id = Column(Integer, ForeignKey("transactions.transaction_id"), primary_key=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), primary_key=True, nullable=False)
    quantity = Column(Integer, nullable=False)
    Size = Column(Enum(Size), nullable=False)
    product = relationship("Product", backref="transaction_products")