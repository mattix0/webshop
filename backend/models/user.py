from sqlmodel import SQLModel, Field

class LoginUser(SQLModel, table=True):
    username: str = Field(primary_key=True)
    password: str