from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from typing import Generator
from config import settings

# Database URL from environment or default to PostgreSQL
DATABASE_URL = settings.DATABASE_URL or "postgresql://user:password@localhost/pose_estimation_db"

# Create SQLAlchemy engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=20,
        max_overflow=30
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Create all tables in the database
    """
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """
    Drop all tables in the database
    """
    Base.metadata.drop_all(bind=engine)

def get_db_session() -> Session:
    """
    Get a database session for direct use
    """
    return SessionLocal()

class DatabaseManager:
    """
    Database manager for handling database operations
    """
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def create_session(self) -> Session:
        """Create a new database session"""
        return self.SessionLocal()
    
    def health_check(self) -> bool:
        """Check if database is healthy"""
        try:
            with self.create_session() as session:
                session.execute("SELECT 1")
                return True
        except Exception:
            return False
    
    def get_connection_info(self) -> dict:
        """Get database connection information"""
        return {
            "url": str(self.engine.url).replace(self.engine.url.password or "", "***"),
            "pool_size": self.engine.pool.size(),
            "checked_out": self.engine.pool.checkedout(),
            "overflow": self.engine.pool.overflow(),
        }

# Global database manager instance
db_manager = DatabaseManager()