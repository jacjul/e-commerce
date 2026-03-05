from pathlib import Path

from api.core.database import engine

sql_path = Path(__file__).resolve().parent / "sql" / "merge_prices_daily.sql"


def import_database(df_valid):
    #get symbols and timestamp as columns 
    df_valid = df_valid.stack(level=0).rename_axis(["ts", "symbol"]).reset_index()

    df_valid.columns = [str(c).strip().lower().replace(" ", "_") for c in df_valid.columns]

    df_valid = df_valid.drop_duplicates(subset=["symbol", "ts"], keep="last")

    if df_valid.empty:
        print("No rows to import")
        return

    with engine.begin() as conn:
        # populate staging table
        df_valid.to_sql(
            "staging_historical_stockdata_daily",
            schema="market_data",
            con=conn,
            if_exists="append",
            index=False,
            method="multi",
            chunksize=10000,
        )

        # run merge/upsert + failed-row routing SQL
        sql = sql_path.read_text(encoding="utf-8")
        conn.exec_driver_sql(sql)

