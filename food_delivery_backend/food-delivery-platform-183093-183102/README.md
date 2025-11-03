# food-delivery-platform-183093-183102

This repository contains a multi-container food delivery platform:

- food_delivery_backend (FastAPI on port 3001)
- food_delivery_database (PostgreSQL on port 5001)
- food_delivery_frontend (React on port 3000)

Features scaffolded
- Auth: register/login with JWT issuance
- Restaurants: list and detail
- Menus: list by restaurant
- Orders: create order and get order status
- Basic React pages to browse restaurants/menus and simple auth forms

Backend (FastAPI)
1) Configure environment
   - Copy env: `cp food_delivery_backend/.env.example food_delivery_backend/.env`
   - Fill:
     - `SECRET_KEY`: long random string
     - `DATABASE_URL`: e.g., `postgresql+psycopg2://user:pass@<db-host>:5001/fooddb`
     - `FRONTEND_ORIGIN`: `http://localhost:3000`

2) Install dependencies (CI handles in preview). If running locally:
   - `pip install -r food_delivery_backend/requirements.txt`

3) Start backend (example):
   - Working dir: `food-delivery-platform-183093-183102`
   - `uvicorn src.api.main:app --host 0.0.0.0 --port 3001 --reload`
   - OpenAPI: `/docs`

4) Seed sample data
   - Ensure database is up and `DATABASE_URL` is set
   - Run: `python -m src.api.seed`
   - Seeds 3 restaurants and 9 menu items

API Endpoints
- POST `/auth/register`
- POST `/auth/login`
- GET `/restaurants`
- GET `/restaurants/{id}`
- GET `/restaurants/{id}/menu`
- POST `/orders`
- GET `/orders/{id}`

Database (PostgreSQL)
- Tables: `users`, `restaurants`, `menu_items`, `orders`, `order_items`, `deliveries`
- Relations include: users->orders, restaurants->menu_items, orders->order_items, orders->delivery
- For scaffold, tables auto-created on backend startup via SQLAlchemy. In production, use migrations (Alembic).

Frontend (React)
1) Configure environment
   - Copy env: `cp food_delivery_frontend/.env.example food_delivery_frontend/.env`
   - Ensure `REACT_APP_BACKEND_URL` points to `http://localhost:3001` or your backend URL

2) Start frontend dev server (example with create-react-app or similar tooling):
   - `npm start` (port 3000)
   - Pages:
     - `/` Home: restaurant list
     - `/restaurants/:id` Restaurant detail and menu; add to cart placeholder and place order
     - `/login` and `/register` auth forms
     - `/order/:id` view order status

Security and configuration
- No hardcoded credentials; use env variables
- CORS configured to allow `FRONTEND_ORIGIN`
- JWT signing uses `SECRET_KEY` (HS256)

Notes
- Acceptance criteria covered: endpoints implemented, app starts, minimal React pages, and env examples included.
- For real auth-protected orders, replace the guest fallback with JWT auth dependency in the orders router.
