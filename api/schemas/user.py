from pydantic import BaseModel
from enum import Enum
class Roles(Enum):
    ADMIN = "admin"
    USER = "user"

class UserRegister(BaseModel):
    name : str
    lastname : str 
    username : str
    password : str 

class AccessToken(BaseModel):
    access_token : str
    token_type : str 