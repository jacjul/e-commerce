from datetime import timedelta, datetime
from typing import Optional
from jose import jwt
from dotenv import load_dotenv
import os
load_dotenv()
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
SECRET_KEY = os.getenv("SECRET_KEY")


def create_access_token(data:dict, validation_delta:Optional[timedelta]=None):
    to_encode = data.copy()
    if validation_delta:
        validation_time = datetime.utcnow() +validation_delta
    else:
        validation_time = datetime.utcnow()+ timedelta(minutes =ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": validation_time})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY,algorithm = ALGORITHM)
    return encoded_jwt
    

def create_refresh_token(data:dict ):
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

def decode_token():
    pass
    