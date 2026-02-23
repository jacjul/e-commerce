# python -m uvicorn api.main:app --port 8000 --reload run from e-commerce
from fastapi import FastAPI, Depends, HTTPException,Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import database
from .models import User, Roles, UserEntry,UserOut,UserLogin
from pwdlib import PasswordHash 
from typing import Annotated
from dotenv import load_dotenv
from .token_helpers import create_access_token,create_refresh_token
load_dotenv()

password_hash = PasswordHash.recommended()
oaut2scheme = OAuth2PasswordBearer(tokenUrl ="token")
app = FastAPI()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)
def get_password_hash(plain_password):
    return password_hash.hash(plain_password)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)

@app.post("/api/user/login")
def login(response:Response, formData:Annotated[OAuth2PasswordRequestForm, Depends()], db:Session= Depends(database.get_db)):
    user = db.query(User).filter(User.username==formData.username).first()
    if not user or not verify_password(formData.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access = create_access_token({"sub":str(user.id), "username":user.username, "role":user.role.value, "type":"access"})
    refresh = create_refresh_token({"sub": str(user.id), "type":"refresh"})

    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="lax", max_age=60*60*24*15)
    return {"access": access, "token-type":"bearer"}


@app.post("api/user/refresh")
def create_new_refresh_token(response:Response, formData: Annotated[OAuth2PasswordRequestForm, Depends()], db:Session=Depends(database.get_db)):
    user = db.query(User).filter(User.username== formData.username).first()
    if user: 
        refresh = create_refresh_token({"sub": str(user.id), "type":"refresh"})
        response.set_cookie("refresh", refresh, httponly=True, secure=True, samesite="lax", max_age=60*60*24*15)

@app.post("/api/user/register" , status_code=201)
def register_user(user: UserEntry, db: Session = Depends(database.get_db)):
    print(user)
    new_user = User(
        name=user.name,
        last_name=user.last_name,
        username=user.username,
        role=Roles.USER,
        password_hash=get_password_hash(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
@app.get("/api/hello")
def hello_world():
    return {"message":f"Hello world "}
