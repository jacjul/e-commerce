import yfinance as yf 
import pandas as pd
import numpy as np 
from pathlib import Path
from dotenv import load_dotenv
import os
from api.core.database import engine
from api.models.stock_data_infos import StockDataInfoStaging
from api.core.database import SessionLocal
from concurrent.futures import ThreadPoolExecutor
import math 

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

symbols = ["AAPL", "TSLA"]

#created the connected tables from sql-folder
def create_all_tables_info_financials_basesheet():
    path = Path(__file__).resolve().parent.parent / "sql" / "create_tables_info_balance_financials.sql"
    sql_stmt = path.read_text(encoding = "utf-8")

    # Use a transaction context so DDL is committed on success.
    with engine.begin() as conn:
        conn.exec_driver_sql(sql_stmt)


#### all function for the staging DB with symbol and jsondump
def get_symbols(limit:int|None = None)->list[str]:
    path = Path(__file__).resolve().parent.parent / "sp500_companies.csv"

    symbols = pd.read_csv(path)["Symbol"].dropna().astype(str).str.strip().unique().tolist()  

    return symbols[:limit] if limit else symbols

#general function without threading but with a session per worker
def download_infos_worker(worker_symbols:list[str]):
    session = SessionLocal()
    ok = 0 
    failed:list[str] = []

    try:
        for symbol in worker_symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                if not info:
                    failed.append(symbol)
                    continue
                stock = StockDataInfoStaging(symbol=symbol, jsondump=info)
                session.merge(stock)
                ok+=1

                if ok %25 ==0:
                    session.commit()

            except Exception as e: 
                session.rollback()
                failed.append(symbol)
                print(f"Following {symbol} failed because {e}")
        session.commit()
        return {"ok":ok , "failed":failed}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def create_chunks_symbol(symbols:list[str], workers:int):
    if not symbols:
        return []
    workers = max(1, min(workers, len(symbols)))
    div:int = math.ceil(len(symbols)/workers)
    return [symbols[i:i+div] for i in range(0,len(symbols),div)]

def multithreading(symbols, max_workers =10):
    
    chunks_symbol:list[list[str]] = create_chunks_symbol(symbols, max_workers)

    with ThreadPoolExecutor(max_workers=min(max_workers,len(chunks_symbol)))as executor:
        results = list(executor.map(download_infos_worker,chunks_symbol))

    return results
                                          

### for submitting information data to company profile table, thats like staging to productive

def submit_to_company_profile():
    
    path = Path(__file__).resolve().parent.parent / "sql" /"update_company_profile.sql"
    stmt = path.read_text(encoding ="utf-8")

    with engine.begin() as conn:
        conn.exec_driver_sql(stmt)

    








if __name__== "__main__":
    
    # This is all run once in order to get the s&p 500 -> cause thats the symbols we import -> this can be used as a cron-job in order to have a regular update
    create_all_tables_info_financials_basesheet()
    symbols = get_symbols()
    results = multithreading(symbols)
    submit_to_company_profile()

