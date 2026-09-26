from fastapi import APIRouter, status, HTTPException
from models import UserCreate, UserLogin, User
from sqlmodel import select
from database import SessionDepends

router = APIRouter(
    prefix="/api/v1",
    tags=["auth"]
)


@router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogin, session: SessionDepends):
    # check if user exists and password are correct
    statement = select(User).where(User.username == user.username)
    query_user = session.exec(statement).first()
    if not query_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if query_user.password == user.password:
        return {"username": query_user.username}
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Password incorrect.")
    

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, session: SessionDepends): 
    # check if user already exists
    statement = select(User).where(User.username == user.username)
    user_exists = session.exec(statement).first()
    if user_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists.")

    # TODO: Hash the user password.
    # register the user
    new_user = User(
        username=user.username,
        password=user.password,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User successfully created."}