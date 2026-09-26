from datetime import datetime, UTC
from sqlmodel import SQLModel, Field
from pydantic import EmailStr

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(min_length=1, nullable=False, unique=True)
    password: str = Field(min_length=6, nullable=False)
    first_name: str = Field(min_length=3, nullable=False)
    last_name: str = Field(min_length=3, nullable=False)
    email: EmailStr = Field(nullable=False)
    phone: str = Field(min_length=1, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class UserCreate(SQLModel):
    username: str = Field(min_length=1, nullable=False)
    password: str = Field(min_length=6, nullable=False)
    first_name: str = Field(min_length=3, nullable=False)
    last_name: str = Field(min_length=3, nullable=False)
    email: EmailStr = Field(nullable=False)
    phone: str = Field(min_length=1, nullable=False)

class UserLogin(SQLModel):
    username: str = Field(min_length=1, nullable=False)
    password: str = Field(min_length=6, nullable=False)