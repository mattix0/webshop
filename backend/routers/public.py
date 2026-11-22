from fastapi import APIRouter, status, HTTPException
from models import Product, ProductOut
from sqlmodel import select
from database import SessionDepends

router = APIRouter(
    prefix="/api/v1",
    tags=["public"]
)


@router.get("/products", response_model=list[ProductOut], status_code=status.HTTP_200_OK)
def get_products(session: SessionDepends):
    return session.exec(
        select(Product).where(Product.is_active == True)  
    ).all()



@router.get("/product/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def get_product(product_id: int, session: SessionDepends):
    product = session.get(Product, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product