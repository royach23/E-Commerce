from sqlalchemy import String, Integer, Column, Double, Enum, Boolean, ARRAY
from app.utils.database import Base
from ..schemas.product import Products
from ..enums.category import Category
from ..enums.size import Size

class Product (Base):
    __tablename__ = 'products'
    product_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column (String, nullable=False)
    description = Column(String, nullable = False)
    price = Column (Double, nullable=False)
    in_stock = Column(Boolean, nullable = False)
    category = Column(Enum(Category))
    sizes = Column(ARRAY(Enum(Size)))
    image = Column(String)

    def to_dict(self):
        return {"product_id": self.product_id, "name": self.name, "description": self.description, "price": self.price, "in_stock": self.in_stock, "category": self.category.value, "sizes": [size.value for size in self.sizes], "image": self.image }

    @staticmethod
    def from_dict(data):
        return Products(**data)