from sqlmodel import SQLModel, Field
from datetime import datetime, UTC
from decimal import Decimal


class Product(SQLModel, table=True):
    __tablename__: str = "products"  # type: ignore

    product_id: int | None = Field(default=None, primary_key=True)
    name: str = Field(min_length=1)
    price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    sku: str = Field(min_length=1, unique=True, index=True)
    image_path: str | None = Field(default=None)
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ProductCreate(SQLModel):
    name: str = Field(min_length=1)
    price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    sku: str = Field(min_length=1, unique=True, index=True)
    image_path: str | None = Field(default=None)


class ProductUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1)
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    stock: int | None = Field(default=None, ge=0)
    sku: str | None = Field(default=None, min_length=1)
    image_path: str | None = Field(default=None)
    is_active: bool | None = Field(default=None)


class ProductOut(SQLModel):
    product_id: int
    name: str
    price: Decimal
    stock: int
    sku: str
    image_path: str | None
    is_active: bool
    created_at: datetime