import os
from contextlib import contextmanager
from typing import Generator, Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# Database configuration using environment variable DATABASE_URL
# Example for PostgreSQL: postgresql+psycopg2://user:password@host:port/dbname
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Allow running app without DB for preview; raise clear error when DB is needed
    # The seed script and endpoints that touch DB will fail with explicit message if not set
    pass

# Create SQLAlchemy engine and session factory lazily to avoid failure if DATABASE_URL missing
_engine = None
_SessionLocal: Optional[sessionmaker] = None
Base = declarative_base()


def get_engine():
    """Create or retrieve the SQLAlchemy engine."""
    global _engine
    if _engine is None:
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL environment variable is not set. Please configure it in the backend .env file.")
        _engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    return _engine


def get_session_factory():
    """Create or retrieve the sessionmaker."""
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal


# PUBLIC_INTERFACE
def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy Session and ensures proper close."""
    db = get_session_factory()()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def db_session() -> Generator[Session, None, None]:
    """Context manager variant for scripts."""
    db = get_session_factory()()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
