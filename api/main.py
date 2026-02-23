from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.database import Base, engine
from api.routes import user
from contextlib import asynccontextmanager


def create_db_and_tables():
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


    