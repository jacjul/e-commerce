from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.models.user import User
from api.models.stock_data_infos import StockDataCompanyProfile
from api.routes.user import get_current_user
from sqlalchemy import select

router = APIRouter(prefix="/stock_data/info")

@router.get("/{symbol}")
def get_info_symbol(symbol:str, db:Session = Depends(get_db), user:User =Depends(get_current_user)):
    
    stmt = select(StockDataCompanyProfile).where(StockDataCompanyProfile.symbol ==symbol)
    symbol_info = db.execute(stmt).scalars().first()
    return symbol_info