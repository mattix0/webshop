from fastapi import APIRouter, HTTPException
from models import LoginUser
from database import SessionDepends

router = APIRouter(
    prefix="/api/v1",
    tags=["auth"]
)


@router.post("/login")
def login(user: LoginUser, session: SessionDepends) -> LoginUser:
    test = session.get(LoginUser, user.username)
    if not test:
        raise HTTPException(status_code=404, detail="User not found!")
    
    print("User Found!")
    return user
