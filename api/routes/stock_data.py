from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.models.stock_data_daily import StockDataDaily,UserFavorites
from sqlalchemy import select,distinct,insert,exists
from datetime import datetime,timedelta
import pandas as pd
import numpy as np 
from api.routes.user import get_current_user
from api.models.user import User

router = APIRouter(prefix="/stock_data")

#### Candles
@router.get("/symbols")
def get_all_symbols(db:Session =Depends(get_db)):
    stmt = select(distinct(StockDataDaily.symbol)).order_by(StockDataDaily.symbol.asc())
    rows = db.execute(stmt).scalars().all()
    return rows
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

#### Chart MultipleStocks
@router.get("/allStocks")
def get_all_stocks(db:Session =Depends(get_db)):
    base_stmt = select(StockDataDaily.symbol,StockDataDaily.ts,StockDataDaily.close)
    stmt_day = base_stmt.order_by(StockDataDaily.symbol.asc(),StockDataDaily.ts.desc()).distinct(StockDataDaily.symbol)

    one_week = datetime.now() - timedelta(days=7)
    one_month= datetime.now()- timedelta(days=30)

    stmt_week = base_stmt.where(StockDataDaily.ts<one_week).order_by(StockDataDaily.symbol.asc(),StockDataDaily.ts.desc()).distinct(StockDataDaily.symbol)
    stmt_month = base_stmt.where(StockDataDaily.ts<one_month).order_by(StockDataDaily.symbol.asc(),StockDataDaily.ts.desc()).distinct(StockDataDaily.symbol)

    #create df
    rows_day = pd.DataFrame(db.execute(stmt_day).mappings().all())
    rows_week =pd.DataFrame(db.execute(stmt_week).mappings().all())
    rows_month =pd.DataFrame(db.execute(stmt_month).mappings().all())

    rows_day["period"] = "day"
    rows_week["period"] = "week"
    rows_month["period"] = "month"

    result_df = pd.concat([rows_day,rows_week,rows_month],ignore_index=True).sort_values(by=["symbol","ts"], ascending=[True,False])
    #change to seconds 
    result_df["ts"] = pd.to_datetime(result_df["ts"], utc=True, errors="coerce")
    result_df["ts"] = result_df["ts"].apply(lambda x: int(x.timestamp()) if x is not pd.NaT else None)
    #cast nan or nat to none
    result_df = result_df.replace({np.nan:None})
    result_df =result_df.replace({pd.NaT:None})
    
    wide = result_df.pivot_table(index="symbol", columns="period", values="close",aggfunc="first").reset_index()
    
    wide["pct_week"] = ((wide["day"]-wide["week"])/wide["week"])*100
    wide["pct_month"] = ((wide["day"]-wide["month"])/wide["month"])*100
    wide["week_indicator"] = wide["pct_week"].apply(lambda x : "up_much" if x>=5 else ("up" if x>=0 else("down_much" if x<= -5 else "down")))
    wide["month_indicator"] =wide["pct_month"].apply(lambda x : "up_much" if x>=5 else ("up" if x>=0 else("down_much" if x<= -5 else "down")))


    records = wide.to_dict(orient = "records")

    return records

### Add to favorites

@router.post("/favorites/{add_symbol}")
def add_to_favorites(add_symbol:str , user:User= Depends(get_current_user), db:Session =Depends(get_db)):
    add_symbol = add_symbol.upper().strip()
    #check for symbol 
    stmt_check = select(exists().where(StockDataDaily.symbol==add_symbol))
    
    symbol_exists  = db.execute(stmt_check).scalar_one()
    if not symbol_exists:
        raise HTTPException (status_code=400, detail="Symbol doesnt exist")

    stmt = insert(UserFavorites).values(user_id=user.id, symbol=add_symbol)
    try:
        db.execute(stmt)
        db.commit()
        return "Successfully added the Symbol"
    except:
        db.rollback()
        raise HTTPException(status_code=401,detail ="Couldnt add the Symbol to favorites")
    
@router.get("/favorites", response_model=list[str])
def get_favorite_stocks_of_user(user:User =Depends(get_current_user), db:Session= Depends(get_db)):

    stmt = select(distinct(UserFavorites.symbol)).where(UserFavorites.user_id ==user.id).order_by(UserFavorites.symbol.asc())
    symbols = db.execute(stmt).scalars().all()

    return symbols

    
     
