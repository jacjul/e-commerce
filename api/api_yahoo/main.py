
import yfinance as yf
import pandas as pd
from   api.api_yahoo.data_validation import verification_df
from api.api_yahoo.database_import import import_database
def download_tickers():
    # initial population of the db 
    names_sp = pd.read_csv("api/api_yahoo/sp500_companies.csv")["Symbol"].to_list()
    end = "2026-03-04"
    start = "2026-02-01"
    

    try:
        df_batch = yf.download(names_sp,start = start, end=end, group_by="ticker", threads=True)    
        if df_batch is None or df_batch.empty:
            raise ValueError("No data downloaded")
        
    except Exception as e: 
        print(f"Following exception occured when trying to download and validate the bulkdata: {e}")
        return 
    
    try: 
        df_valid = verification_df(df_batch)
    except Exception as e: 
        print(f"Validation failed {e}")
        return 
    
    try:
        import_database(df_valid)
    except Exception as e:
        print(f"db import failed: {e}")
        return 





if __name__ == "__main__":
    download_tickers()

    