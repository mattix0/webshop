from fastapi import APIRouter, Depends
from models import User, UserOut
from helper import AdminUser, require_admin
from sqlmodel import select
from database import SessionDepends


router = APIRouter(
    prefix="/api/v1",
    tags=["admin"],
    dependencies=[Depends(require_admin)]
)


@router.get("/costumers", response_model=list[UserOut])
def all_customers(admin: AdminUser, session: SessionDepends):
    return session.exec(select(User)).all()