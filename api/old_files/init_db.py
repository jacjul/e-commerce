from .database import Base
from .database import engine 

Base.metadata.create_all(bind =engine)
print("DB created successfully")