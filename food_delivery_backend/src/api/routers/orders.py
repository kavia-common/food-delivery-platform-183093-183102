from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Order, OrderItem, MenuItem, User
from ..schemas import OrderCreate, OrderOut, OrderItemOut

router = APIRouter(prefix="/orders", tags=["Orders"])


def _get_user_or_anon(db: Session) -> User:
    """
    For initial scaffolding we create or reuse a default user if none auth is provided.
    In future, replace with dependency that extracts user from JWT.
    """
    email = "guest@example.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        from passlib.hash import bcrypt
        user = User(email=email, password_hash=bcrypt.hash("guest"))
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.post("", response_model=OrderOut, summary="Create order", description="Create a new order with given items; returns the created order.")
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    user = _get_user_or_anon(db)
    # Validate menu items and compute total
    total = 0.0
    order = Order(user_id=user.id, status="PENDING", total_amount=0.0)
    db.add(order)
    db.flush()  # get order.id

    for item in order_in.items:
        menu = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id, MenuItem.is_available == 1).first()
        if not menu:
            raise HTTPException(status_code=400, detail=f"Menu item {item.menu_item_id} not found or unavailable")
        line_total = float(menu.price) * item.quantity
        total += line_total
        oi = OrderItem(order_id=order.id, menu_item_id=menu.id, quantity=item.quantity, unit_price=float(menu.price))
        db.add(oi)

    order.total_amount = float(total)
    db.commit()
    db.refresh(order)
    # Load items to return
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return OrderOut(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=[OrderItemOut(menu_item_id=oi.menu_item_id, quantity=oi.quantity, unit_price=oi.unit_price) for oi in order_items],
    )


@router.get("/{order_id}", response_model=OrderOut, summary="Get order", description="Retrieve order by id.")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return OrderOut(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=[OrderItemOut(menu_item_id=oi.menu_item_id, quantity=oi.quantity, unit_price=oi.unit_price) for oi in items],
    )
