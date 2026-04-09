# python -m uvicorn api.main:app --port 8000 --reload run from e-commerce

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.database import Base, engine
from api.routes import user,stock_data, stock_data_info, stock_data_comparison, update_databases
from contextlib import asynccontextmanager
from sqlalchemy import text


def create_db_and_tables():
    with engine.begin() as conn:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS market_data"))
    Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware, 
    allow_origins = origins, 
    allow_headers =["*"], 
    allow_methods =["*"],
    allow_credentials=True
)


app.include_router(user.router, prefix="/api")
app.include_router(stock_data.router,prefix="/api")
app.include_router(stock_data_info.router, prefix ="/api")
app.include_router(stock_data_comparison.router, prefix = "/api")
app.include_router(update_databases.router, prefix="/api")


