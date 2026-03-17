import pandas as pd 

def verification_df(df_batch:pd.DataFrame)-> pd.DataFrame:
    verification_index(df_batch)
    verification_data(df_batch)
    ### Check for missing data is not implemented
    return df_batch

def verification_index(df_batch:pd.DataFrame)-> None :
    if not isinstance(df_batch.columns, pd.MultiIndex):
        raise TypeError("The provided df doesnt have a Multiindex as Column ")
    
    if not isinstance(df_batch.index, pd.DatetimeIndex):
        raise TypeError("The given df doesn't use a DatetimeIndex")

    df_batch = df_batch[~df_batch.index.duplicated(keep="first")]

def verification_data(df_batch:pd.DataFrame)-> None :
    #Sorting
    df_batch = df_batch.sort_index()
    df_batch = df_batch.sort_index(axis=1)

    #Check isna-values
    df_isna = df_batch[df_batch.isna().any(axis=1)]
    if df_isna.notna().any().any():
        print("df_isna")
        
        # could perform delete of symbol if thresh higher then x 

    #Check high,low,open, 
    validation_stock_data(df_batch)

def validation_stock_data(df_batch):
    high = df_batch.xs("High", level=1, axis=1)
    low = df_batch.xs("Low", level=1, axis=1)
    open = df_batch.xs("Open", level=1, axis=1)
    close = df_batch.xs("Open", level=1, axis=1)

    #Validation high
    df_bool_high = high< pd.concat([open, close], axis=1, keys=['Open','Close']).T.groupby(level=1).max().T
    invalid_high = high[df_bool_high]

    df_bool_low = low > pd.concat([open,close], axis=1,keys=["Open","Close"]).T.groupby(level=1).min().T
    invalid_low = low[df_bool_low]

    invalid_g = invalid_high | invalid_low
    if invalid_g.notna().any().any():
        print("invalid_g")
        

    #Validation Volume, Dividents,Stock Splits

    vol = df_batch.xs("Volume", level=1,axis=1)
    vol_neg= vol.where(vol < 0)
    if vol_neg.notna().any().any():
        print("vol_neg")
        print (vol_neg) 

    names_multiindex = set(df_batch.columns.get_level_values(1))
    if "Dividends" in names_multiindex:
        div = df_batch.xs("Dividends", level=1,axis=1)
        div_neg = div.where(div < 0)
        if div_neg.notna().any().any():
            print("div_neg")
    if "Stock Splits" in names_multiindex:
        split = df_batch.xs("Stock Splits", level=1,axis=1)
        split_neg = split.where(split <0 )
        if split_neg.notna().any().any():
            print("split_neg")
    
