from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, func
from api.core.database import Base
from datetime import datetime 
from api.schemas.user import Roles
from typing import Optional
class TimeStamps: 
    created_at:Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at:Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), server_onupdate=func.now())

class User(Base, TimeStamps):
    __tablename__ = "user"
    
    id:Mapped[int] = mapped_column(primary_key =True)
    name:Mapped[str] = mapped_column(String(40))
    lastname:Mapped[str]= mapped_column(String(40))
    username:Mapped[str] = mapped_column(String(50), unique=True)
    hashed_password:Mapped[str]= mapped_column(String(120))
    hashed_refresh_token:Mapped[Optional[str]] = mapped_column(String(140))
    role:Mapped[Roles]
