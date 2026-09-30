from datetime import datetime, UTC
from decimal import Decimal
from enum import Enum
from typing import Optional
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from models import Product


class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    cancelled = "cancelled"


class Order(SQLModel, table=True):
    __tablename__: str = "orders"  # type: ignore

    order_id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="users.user_id", index=True)
    status: OrderStatus = Field(default=OrderStatus.pending)
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    phone: str = Field(min_length=1)
    address: str = Field(min_length=1)
    country: str = Field(min_length=1)
    postal_code: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    items: list["OrderItem"] = Relationship(
        back_populates="order",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "selectin",
        },
    )


class OrderItem(SQLModel, table=True):
    __tablename__: str = "order_items"  # type: ignore
    order_item_id: int | None = Field(default=None, primary_key=True)
    order_id: int | None = Field(
        default=None,
        foreign_key="orders.order_id",
        index=True,
        nullable=False,
    )
    product_id: int = Field(foreign_key="products.product_id", index=True)
    quantity: int = Field(ge=1)
    unit_price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    product_name: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    image_path: str | None = Field(default=None)
    order: Optional[Order] = Relationship(back_populates="items")
    product: Optional["Product"] = Relationship()


class OrderItemCreate(SQLModel):
    product_id: int
    quantity: int = Field(ge=1)


class OrderCreate(SQLModel):
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderStatusUpdate(SQLModel):
    status: OrderStatus


class OrderItemOut(SQLModel):
    order_item_id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    product_name: str
    sku: str
    image_path: str | None


class OrderOut(SQLModel):
    order_id: int
    user_id: int | None
    status: OrderStatus
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    country: str
    postal_code: str
    created_at: datetime
    items: list[OrderItemOut]