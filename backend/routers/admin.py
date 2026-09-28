from fastapi import APIRouter, Depends, status, HTTPException
from models import User, UserOut, Product, ProductCreate
from helper import AdminUser, require_admin
from sqlmodel import select
from database import SessionDepends


router = APIRouter(
    prefix="/api/v1",
    tags=["admin"],
    dependencies=[Depends(require_admin)]
)


@router.get("/costumers", response_model=list[UserOut], status_code=status.HTTP_200_OK)
def get_all_customers(admin: AdminUser, session: SessionDepends):
    return session.exec(select(User)).all()



@router.post("/product/new", status_code=status.HTTP_201_CREATED)
def create_new_product(data: ProductCreate, admin: AdminUser, session: SessionDepends):
    product = session.exec(
        select(Product).where(Product.sku == data.sku)).first()

    if product:
        raise HTTPException(status_code=409, detail="SKU already exists.")

    new_product = Product(**data.model_dump())

    session.add(new_product)
    session.commit()
    session.refresh(new_product)

    return {"message": "Product created."}