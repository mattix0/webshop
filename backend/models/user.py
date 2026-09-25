from pydantic import BaseModel, EmailStr

class LoginModel(BaseModel):
    username: str
    password: str

class RegisterModel(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: int