
#%%
import yfinance as yf
import pandas as pd


# initial population of the db 
names_sp = pd.read_csv("sp500_companies.csv")["Symbol"]

yf.download(["AAPL"], period ="1mo")







# %%
