from datetime import datetime, UTC
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from enum import Enum


class Role(str, Enum):
    user = "user"
    admin = "admin"


class User(SQLModel, table=True):
    __tablename__: str = "users"  #  type: ignore
    
    user_id: int | None = Field(default=None, primary_key=True)
    username: str = Field(min_length=1, nullable=False, unique=True)
    password: str = Field(min_length=6, nullable=False)
    first_name: str = Field(min_length=3, nullable=False)
    last_name: str = Field(min_length=3, nullable=False)
    email: EmailStr = Field(nullable=False, unique=True)
    phone: str = Field(min_length=1, nullable=False)
    address: str = Field(min_length=1, nullable=False)
    country: str = Field(min_length=1, nullable=False)
    postal_code: str = Field(min_length=1, nullable=False)
    role: Role = Field(default=Role.user)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class UserCreate(SQLModel):
    username: str
    password: str = Field(min_length=6, max_length=128)
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    country: str
    postal_code: str


class UserLogin(SQLModel):
    username: str
    password: str


class UserOut(SQLModel):
    user_id: int
    username: str
    email: str
    first_name: str
    last_name: str
    phone: str
    role: Role
    address: str
    country: str
    postal_code: str

class UserResponse(SQLModel):
    token: str
    user: UserOut