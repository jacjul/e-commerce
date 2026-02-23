from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , DeclarativeBase,Session
import os
from typing import Generator

DATABASE_URL = os.environ.get("DATABASE_URL","sqlite:///test.db")
engine= create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    bind = engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False)

def get_db() ->Generator[Session, None,None]:
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

class Base(DeclarativeBase):
    pass