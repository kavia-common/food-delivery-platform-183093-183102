"""
Seed script to populate initial restaurants and menu items.

Usage:
  Run this module with the backend environment configured (DATABASE_URL).
"""
from .database import db_session, Base, get_engine
from .models import Restaurant, MenuItem


def run_seed():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    with db_session() as db:
        # Avoid duplicate seeding
        if db.query(Restaurant).count() > 0:
            print("Seed: restaurants already exist, skipping.")
            return

        restaurants = [
            Restaurant(name="Pasta Palace", description="Fresh Italian pasta", image_url=None),
            Restaurant(name="Sushi Central", description="Authentic sushi and sashimi", image_url=None),
            Restaurant(name="Burger Barn", description="Juicy gourmet burgers", image_url=None),
        ]
        db.add_all(restaurants)
        db.flush()

        items = [
            # Pasta Palace
            MenuItem(restaurant_id=restaurants[0].id, name="Spaghetti Carbonara", description="Creamy sauce with pancetta", price=12.5, is_available=1),
            MenuItem(restaurant_id=restaurants[0].id, name="Penne Arrabiata", description="Spicy tomato sauce", price=10.0, is_available=1),
            MenuItem(restaurant_id=restaurants[0].id, name="Fettuccine Alfredo", description="Rich Alfredo sauce", price=11.5, is_available=1),
            # Sushi Central
            MenuItem(restaurant_id=restaurants[1].id, name="Salmon Nigiri", description="Fresh salmon over rice", price=8.0, is_available=1),
            MenuItem(restaurant_id=restaurants[1].id, name="California Roll", description="Crab, avocado, cucumber", price=7.5, is_available=1),
            MenuItem(restaurant_id=restaurants[1].id, name="Tuna Sashimi", description="Sliced raw tuna", price=9.0, is_available=1),
            # Burger Barn
            MenuItem(restaurant_id=restaurants[2].id, name="Classic Cheeseburger", description="Cheddar, lettuce, tomato", price=9.5, is_available=1),
            MenuItem(restaurant_id=restaurants[2].id, name="BBQ Bacon Burger", description="BBQ sauce and crispy bacon", price=11.0, is_available=1),
            MenuItem(restaurant_id=restaurants[2].id, name="Veggie Burger", description="Grilled veggie patty", price=8.5, is_available=1),
        ]
        db.add_all(items)
        print("Seed: inserted restaurants and menu items.")


if __name__ == "__main__":
    run_seed()
