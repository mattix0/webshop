from fastapi import APIRouter, Depends, status, HTTPException
from models import (User, UserOut, Product, ProductCreate, ProductUpdate, ProductOut,
                    OrderOut, Order, OrderStatusUpdate, OrderStatus)
from helper import AdminUser, require_admin
from sqlmodel import select, col
from database import SessionDepends


router = APIRouter(
    prefix="/api/v1",
    tags=["admin"],
    dependencies=[Depends(require_admin)]
)


@router.get("/costumers", response_model=list[UserOut], status_code=status.HTTP_200_OK)
def get_all_customers(admin: AdminUser, session: SessionDepends):
    return session.exec(select(User)).all()


@router.get("/admin/products", response_model=list[ProductOut], status_code=status.HTTP_200_OK)
def get_all_products(admin: AdminUser, session: SessionDepends):
    """Every product, including the deactivated ones."""
    return session.exec(
        select(Product).order_by(col(Product.created_at).desc())
    ).all()


@router.post("/product/new", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_new_product(data: ProductCreate, admin: AdminUser, session: SessionDepends):
    product = session.exec(
        select(Product).where(Product.sku == data.sku)).first()

    if product:
        raise HTTPException(status_code=409, detail="SKU already exists.")

    new_product = Product(**data.model_dump())

    session.add(new_product)
    session.commit()
    session.refresh(new_product)

    return new_product


@router.patch("/product/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def update_product(
    product_id: int,
    data: ProductUpdate,
    admin: AdminUser,
    session: SessionDepends,
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    changes = data.model_dump(exclude_unset=True)

    if "sku" in changes and changes["sku"] != product.sku:
        taken = session.exec(
            select(Product).where(Product.sku == changes["sku"])
        ).first()
        if taken:
            raise HTTPException(status_code=409, detail="SKU already exists.")

    for key, value in changes.items():
        setattr(product, key, value)

    session.add(product)
    session.commit()
    session.refresh(product)

    return product


@router.delete("/product/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def deactivate_product(product_id: int, admin: AdminUser, session: SessionDepends):
    """Soft delete: the product leaves the shop but stays on past orders."""
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    product.is_active = False
    session.add(product)
    session.commit()
    session.refresh(product)

    return product


@router.get("/orders", response_model=list[OrderOut], status_code=status.HTTP_200_OK)
def get_all_orders(admin: AdminUser, session: SessionDepends):
    return session.exec(
        select(Order)
        .order_by(col(Order.created_at).desc())
    ).all()


@router.patch("/orders/{order_id}", response_model=OrderOut, status_code=status.HTTP_200_OK)
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    admin: AdminUser,
    session: SessionDepends,
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.status == data.status:
        return OrderOut.model_validate(order)

    if order.status == OrderStatus.cancelled:
        raise HTTPException(
            status_code=409,
            detail="A cancelled order cannot be reopened.",
        )

    if data.status == OrderStatus.cancelled:
        product_ids = [item.product_id for item in order.items]
        products = session.exec(
            select(Product)
            .where(col(Product.product_id).in_(product_ids))
            .with_for_update()
        ).all()
        by_id = {p.product_id: p for p in products}

        for item in order.items:
            product = by_id.get(item.product_id)
            if product:
                product.stock += item.quantity
                session.add(product)

    order.status = data.status
    session.add(order)
    session.commit()
    session.refresh(order)

    return OrderOut.model_validate(order)