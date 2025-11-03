from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Restaurant, MenuItem
from ..schemas import RestaurantOut, MenuItemOut

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])


@router.get("", response_model=list[RestaurantOut], summary="List restaurants", description="Retrieve list of restaurants.")
def list_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).order_by(Restaurant.name.asc()).all()


@router.get("/{restaurant_id}", response_model=RestaurantOut, summary="Get restaurant", description="Retrieve a specific restaurant by id.")
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    r = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return r


@router.get("/{restaurant_id}/menu", response_model=list[MenuItemOut], summary="List menu items", description="List menu items for a given restaurant.")
def list_menu(restaurant_id: int, db: Session = Depends(get_db)):
    # Ensure restaurant exists
    exists = db.query(Restaurant.id).filter(Restaurant.id == restaurant_id).first()
    if not exists:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    items = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id, MenuItem.is_available == 1).order_by(MenuItem.name.asc()).all()
    return items
