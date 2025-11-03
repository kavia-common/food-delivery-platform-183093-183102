import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, get_engine
from .routers import auth as auth_router
from .routers import restaurants as restaurants_router
from .routers import orders as orders_router

openapi_tags = [
    {"name": "Auth", "description": "User registration and login"},
    {"name": "Restaurants", "description": "Browse restaurants and menus"},
    {"name": "Orders", "description": "Create and track orders"},
]

app = FastAPI(
    title="Food Delivery Backend",
    description="REST API for authentication, restaurants, menus, and orders.",
    version="0.1.0",
    openapi_tags=openapi_tags,
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "*"],  # Allow '*' for initial preview convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"], summary="Health Check", description="Simple health endpoint.")
def health_check():
    return {"message": "Healthy"}


# Register routers
app.include_router(auth_router.router)
app.include_router(restaurants_router.router)
app.include_router(orders_router.router)


@app.on_event("startup")
def on_startup():
    """
    Startup hook to initialize database tables.
    In production consider Alembic migrations; for scaffold we auto-create tables.
    """
    try:
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # Don't crash the whole app for preview; log-ish print. Many endpoints will still work without DB.
        print(f"[Startup] Database initialization skipped or failed: {e}")
