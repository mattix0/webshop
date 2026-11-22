from fastapi import APIRouter, status, HTTPException
from models import (UserCreate, UserLogin, User, 
                    UserResponse, UserOut, Product, 
                    OrderCreate, OrderItem, Order,
                    OrderOut)
from helper import verify_password, create_token, hash_password, CurrentUser, AdminUser
from sqlmodel import select, col
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


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, session: SessionDepends, current_user: CurrentUser):
    # collapse duplicate lines, so two entries for the same product become one
    wanted: dict[int, int] = {}
    for line in payload.items:
        wanted[line.product_id] = wanted.get(line.product_id, 0) + line.quantity

    # one query for every product, locked so two concurrent orders
    # cannot both pass the stock check
    products = session.exec(
        select(Product)
        .where(col(Product.product_id).in_(list(wanted)))
        .with_for_update()
    ).all()
    by_id = {p.product_id: p for p in products}

    missing = set(wanted) - set(by_id)
    if missing:
        raise HTTPException(404, f"Unknown product id: {sorted(missing)}")

    order = Order(
        user_id=current_user.user_id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        phone=current_user.phone,
        address=current_user.address,
        country=current_user.country,
        postal_code=current_user.postal_code,
    )

    for product_id, quantity in wanted.items():
        product = by_id[product_id]
        if product.stock < quantity:
            raise HTTPException(
                409,
                f"Only {product.stock} left of {product.name}.",
            )
        product.stock -= quantity

        order.items.append(
            OrderItem(
                product_id=product_id,
                quantity=quantity,
                unit_price=product.price,
                product_name=product.name,
                sku=product.sku,
                image_path=product.image_path,
            )
        )
        session.add(product)

    session.add(order)
    session.commit()
    session.refresh(order)

    return OrderOut.model_validate(order)


@router.get("/my-orders", response_model=list[OrderOut], status_code=status.HTTP_200_OK)
def get_my_orders(session: SessionDepends, current_user: CurrentUser):
    return session.exec(
        select(Order)
        .where(Order.user_id == current_user.user_id)
        .order_by(col(Order.created_at).desc())
    ).all()


@router.get("/my-orders/{order_id}", response_model=OrderOut, status_code=status.HTTP_200_OK)
def get_my_order(order_id: int, session: SessionDepends, current_user: CurrentUser):
    order = session.get(Order, order_id)

    # a 403 here would confirm the order exists, so unknown and
    # not-yours both answer the same way
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Order not found.")

    return order