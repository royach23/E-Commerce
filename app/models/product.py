from sqlalchemy import String, Integer, Column, Double
from app.utils.database import Base

class Product (Base):
    __tablename__ = 'products'
    product_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column (String, nullable=False)
    description = Column(String)
    price = Column (Double, nullable=False)
    quantity_in_stock = Column(Integer)
    category = Column (String)