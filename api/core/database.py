from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from dotenv import load_dotenv
import os
from pathlib import Path
from typing import Generator

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

DATABASE_URL = os.environ.get(
    "DATABASE_URL"  
)
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in .env")

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def run_sql_file(path:Path) -> None:
    sql = path.read_text(encoding="utf-8")

    with engine.begin() as conn:
        conn.exec_driver_sql(sql)
class Base(DeclarativeBase):
    pass


if __name__ == "__main__":
    print("This has to be run once manually in order to create the DBs")
    SQL_DIR = Path(__file__).resolve().parent.parent /"api_yahoo"/ "sql"
    run_sql_file(SQL_DIR/ "create_tables.sql")
    