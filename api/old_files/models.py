from sqlalchemy.orm import  Mapped, mapped_column 
from sqlalchemy import String
from enum import Enum 
from .database import Base
from pydantic import BaseModel


class Roles(Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):

    __tablename__ = "user"

    id:Mapped[int] = mapped_column(primary_key = True)
    name:Mapped[str] = mapped_column(String(30))
    last_name:Mapped[str] = mapped_column(String(40))
    username:Mapped[str] = mapped_column(String(40), unique=True)
    role:Mapped[Roles] 
    password_hash:Mapped[str]= mapped_column(String(120))


class UserEntry(BaseModel):
    name: str
    last_name: str
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password:str
    
class UserOut(BaseModel):
    id: int
    name: str
    last_name: str
    username: str
    role: Roles

    class Config:
        from_attributes = True