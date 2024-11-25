from sqlalchemy import String, Integer, Column, Double
from app.utils.database import Base
from ..schemas.product import Products

class Product (Base):
    __tablename__ = 'products'
    product_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column (String, nullable=False)
    description = Column(String)
    price = Column (Double, nullable=False)
    quantity_in_stock = Column(Integer)
    category = Column (String)

    def to_dict(self):
        return {"name": self.name, "description": self.description, "price": self.price, "quantity_in_stock": self.quantity_in_stock, "category": self.category}

    @staticmethod
    def from_dict(data):
        return Products(**data)