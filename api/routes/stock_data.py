from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.models.stock_data_daily import StockDataDaily
from sqlalchemy import select

router = APIRouter(prefix="/stock_data")

@router.get("/general/{symbol}")
def get_general_stock_data(symbol:str, db:Session =Depends(get_db)):
    stmt = (
        select(StockDataDaily)
        .where(StockDataDaily.symbol == symbol.upper())
        .order_by(StockDataDaily.ts.desc())
        
    )
    rows = db.execute(stmt).scalars().all()

    return [{
        "symbol": r.symbol,
        "time": int(r.ts.timestamp()),
        "open":float(r.open) if r.open is not None else None,
        "high":float(r.high) if r.high is not None else None,
        "low": float(r.low) if r.low is not None else None,
        "close":float(r.close) if r.close is not None else None
    } for r in rows ]