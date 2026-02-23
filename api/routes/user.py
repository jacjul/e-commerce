from fastapi import APIRouter, Depends, HTTPException, Response,Cookie
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.schemas.user import UserRegister, Roles, AccessToken
from api.core.database import get_db
from api.models.user import User
import re 
from api.routes.helpers_user import hash_password, is_valid, create_access_token,decode_token,create_refresh_token
from api.schemas.user import AccessToken


router = APIRouter(prefix="/user")


@router.post("/register")
def register_new_account(user:UserRegister, db:Session = Depends(get_db)):
    
    if db.query(User).filter(User.username ==user.username).first():
        raise HTTPException(status_code =404, detail ="Username already exists")
    
    re_pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$"
    if not bool(re.match(re_pattern, user.password)):
        raise HTTPException(status_code = 404, detail = "Registered Password doesn't satisfy the password standards")

    hashed_password =  hash_password(user.password)
    user_data = user.model_dump()
    del user_data["password"]
    user_data["hashed_password"] = hashed_password

    db_user = User(**user_data , role=Roles.USER)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)



@router.post("/login")
def login_user(response:Response, user: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)) ->AccessToken:
    
    current_user = db.query(User).filter(User.username == user.username).first()

    if not current_user: 
        raise HTTPException(status_code=400, detail = "Username not found")

    if not is_valid(user.password, current_user.hashed_password):
        raise HTTPException(status_code =400, detail = "Password doesn't match the saved password")

    data_access_token = {"sub": current_user.id , "scope":current_user.role, "iat":current_user.created_at}
    access_token = create_access_token(data_access_token)
    refresh_token = create_refresh_token({"sub":current_user.id})

    current_user.hashed_refresh_token = hash_password(refresh_token)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
    return AccessToken(access_token=access_token , token_type= "Bearer")

oauth2scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

@router.post("/me")
def get_current_user(token:str = Depends(oauth2scheme), db:Session =Depends(get_db)):
    
    payload = decode_token(token)
    current_user = db.query(User).filter(User.id == payload.get("sub"))

    return current_user

@router.post("/refresh")
def refresh_access_token(response:Response,refresh_token:str|None = Cookie(None), db:Session = Depends(get_db))-> AccessToken:
    if not refresh_token:
        raise HTTPException(status_code=401, detail = "Refreshtoken is missing")
    
    try:
        payload = decode_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail = "Refresh is expired or invalid")
    
    current_user = db.query(User).filter(payload.get("sub")==User.id).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    data_access_token = {"sub": current_user.id , "scope":current_user.role, "iat":current_user.created_at}
    access_token= create_access_token(data_access_token)
    refresh_token= create_refresh_token({"sub":current_user.id})
    #updating backend
    current_user.hashed_refresh_token = hash_password(refresh_token)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    #frontend -> secure=True maybe patch for dev since it can hinder dev 
    response.set_cookie(key="refresh_cookie", value=refresh_token, httponly=True, secure=True)


    return AccessToken(access_token= access_token, token_type="Bearer")


