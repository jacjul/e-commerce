from datetime import datetime, timedelta
from pwdlib import PasswordHash
from dotenv import load_dotenv
import os 
import jwt
from api.schemas.user import AccessToken
from fastapi import HTTPException
from jose import JWTError

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES",30))
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES",60*24*15))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
### Helpers for register
password_hash = PasswordHash.recommended() # is downloaded with argon2 

def hash_password(password):
    return password_hash.hash(password)

def is_valid(password, hashed_password):
    return password_hash.verify(password, hashed_password)


### Helpers for login 

def create_access_token(data:dict , expiry_delta:int|None =None):
    to_encode = data.copy()

    if expiry_delta: 
        expire = datetime.now() + timedelta(expiry_delta)
    
    else:
        expire = datetime.now()+ timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    decoded:str = jwt.encode(to_encode, key = SECRET_KEY,algorithm= ALGORITHM)

    return decoded

def create_refresh_token(data:dict , expiry_delta:int|None =None):
    to_encode = data.copy()

    if expiry_delta: 
        expire = datetime.now() + timedelta(expiry_delta)
    
    else:
        expire = datetime.now()+ timedelta(REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    decoded:str = jwt.encode(to_encode, key = SECRET_KEY,algorithm= ALGORITHM)

    return decoded

### Helper for restricted access 

def decode_token(token:str):
    credentials_exception = HTTPException(status_code = 401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, key=SECRET_KEY ,algorithm= ALGORITHM)
        if payload.get("sub") is None: 
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception
