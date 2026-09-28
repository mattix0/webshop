from fastapi import APIRouter, status, HTTPException
from models import UserCreate, UserLogin, User, UserResponse, UserOut, Product, ProductOut
from helper import verify_password, create_token, hash_password, CurrentUser, AdminUser
from sqlmodel import select
from database import SessionDepends

router = APIRouter(
    prefix="/api/v1",
    tags=["auth"]
)


@router.post("/login", response_model=UserResponse, status_code=status.HTTP_200_OK)
def login(data: UserLogin, session: SessionDepends):
    user = session.exec(select(User).where(User.username == data.username)).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    return UserResponse(token=create_token(user), user=UserOut.model_validate(user))    


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: SessionDepends): 
    user = session.exec(
        select(User).where(
            (User.username == data.username) | (User.email == data.email))).first()
    
    if user:
        raise HTTPException(status_code=409, detail="Username or email already in use.")

    new_user = User(
        **data.model_dump(
            exclude={"password"}), 
            password=hash_password(data.password))

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created."}


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser):
    return user


@router.get("/products", response_model=list[ProductOut],status_code=status.HTTP_200_OK)
def get_all_products(user: CurrentUser, session: SessionDepends):
    return session.exec(select(Product)).all()


@router.get("/product/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def get_product(user: CurrentUser, session: SessionDepends, product_id: int):
    product = session.exec(
        select(Product).where(Product.product_id == product_id)
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    return product