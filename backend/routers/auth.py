from fastapi import APIRouter
from models import LoginModel

router = APIRouter(
    prefix="/api/v1",
    tags=["auth"]
)

@router.post("/login")
def login(user: LoginModel):
    # TODO: Database connection to check for the user.
    fake_users = {
        "admin": "1234",
        "test": "1337",
        "user": "password",
        "god": "l33t"
    }

    if user.username in fake_users:
        password = fake_users[user.username]
        if user.password == password:
            return {
                    "username": user.username,
                    "password": password
                }

    return {"message": "Error logging in."}