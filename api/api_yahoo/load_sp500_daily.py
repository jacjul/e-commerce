from __future__ import annotations

import argparse
import io
from pathlib import Path
from typing import Iterable

import pandas as pd
import yfinance as yf
from sqlalchemy import create_engine, text

try:
    from api.core.database import engine
except Exception:
    import os

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set.")
    engine = create_engine(database_url, pool_pre_ping=True)


THIS_DIR = Path(__file__).resolve().parent
SYMBOLS_FILE = THIS_DIR / "sp500_companies.csv"
DDL_FILE = THIS_DIR / "postgres_prices_daily.sql"
MERGE_FILE = THIS_DIR / "merge_prices_daily.sql"


def execute_sql_script(script: str) -> None:
    statements = [stmt.strip() for stmt in script.split(";") if stmt.strip()]
    if not statements:
        return
    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))


def load_sp500_symbols(symbols_file: Path = SYMBOLS_FILE) -> list[str]:
    symbols = pd.read_csv(symbols_file)["Symbol"].dropna().astype(str).str.strip().tolist()
    return sorted(set(symbols))


def _normalize_columns(data: pd.DataFrame) -> pd.DataFrame:
    data.columns = [
        str(col).strip().lower().replace(" ", "_").replace(".", "_")
        for col in data.columns
    ]
    return data


def normalize_download(raw: pd.DataFrame, symbols: Iterable[str]) -> pd.DataFrame:
    symbols = list(symbols)
    if raw.empty:
        return pd.DataFrame(
            columns=["symbol", "ts", "open", "high", "low", "close", "adj_close", "volume"]
        )

    frames: list[pd.DataFrame] = []

    if isinstance(raw.columns, pd.MultiIndex):
        level_0 = set(raw.columns.get_level_values(0))
        symbol_level = 0 if any(symbol in level_0 for symbol in symbols) else 1

        for symbol in symbols:
            values = raw.columns.get_level_values(symbol_level)
            if symbol not in values:
                continue
            symbol_df = raw.xs(symbol, axis=1, level=symbol_level).copy()
            if isinstance(symbol_df, pd.Series):
                symbol_df = symbol_df.to_frame(name="close")
            symbol_df = _normalize_columns(symbol_df)
            symbol_df["symbol"] = symbol
            frames.append(symbol_df)
    else:
        single_symbol = symbols[0] if symbols else "UNKNOWN"
        single_df = raw.copy()
        single_df = _normalize_columns(single_df)
        single_df["symbol"] = single_symbol
        frames.append(single_df)

    if not frames:
        return pd.DataFrame(
            columns=["symbol", "ts", "open", "high", "low", "close", "adj_close", "volume"]
        )

    data = pd.concat(frames, axis=0).reset_index()
    first_col = data.columns[0]
    data = data.rename(columns={first_col: "ts"})
    data = _normalize_columns(data)

    if "adj_close" not in data.columns:
        data["adj_close"] = pd.NA

    expected_columns = ["symbol", "ts", "open", "high", "low", "close", "adj_close", "volume"]
    for column in expected_columns:
        if column not in data.columns:
            data[column] = pd.NA

    data = data[expected_columns].copy()
    data["ts"] = pd.to_datetime(data["ts"], utc=True, errors="coerce")
    data = data.dropna(subset=["symbol", "ts", "open", "high", "low", "close"])

    numeric_columns = ["open", "high", "low", "close", "adj_close", "volume"]
    for column in numeric_columns:
        data[column] = pd.to_numeric(data[column], errors="coerce")

    data = data[(data["high"] >= data["low"]) | data["high"].isna() | data["low"].isna()]
    data = data[(data["volume"] >= 0) | data["volume"].isna()]

    data["source"] = "yfinance"
    data["loaded_at"] = pd.Timestamp.now(tz="UTC")

    return data.sort_values(["symbol", "ts"]).reset_index(drop=True)


def run_ddl() -> None:
    ddl_sql = DDL_FILE.read_text(encoding="utf-8")
    execute_sql_script(ddl_sql)


def stage_with_to_sql(data: pd.DataFrame) -> None:
    data.to_sql(
        name="staging_prices_daily",
        schema="market_data",
        con=engine,
        if_exists="append",
        index=False,
        chunksize=10_000,
        method="multi",
    )


def stage_with_copy(data: pd.DataFrame) -> None:
    csv_buffer = io.StringIO()
    copy_data = data.copy()
    copy_data["ts"] = copy_data["ts"].dt.strftime("%Y-%m-%d %H:%M:%S%z")
    copy_data["loaded_at"] = pd.to_datetime(copy_data["loaded_at"], utc=True).dt.strftime("%Y-%m-%d %H:%M:%S%z")
    copy_data.to_csv(csv_buffer, index=False, header=False)
    csv_buffer.seek(0)

    copy_sql = """
    COPY market_data.staging_prices_daily
    (symbol, ts, open, high, low, close, adj_close, volume, source, loaded_at)
    FROM STDIN WITH (FORMAT csv)
    """

    raw_conn = engine.raw_connection()
    try:
        cur = raw_conn.cursor()
        try:
            cur.copy_expert(copy_sql, csv_buffer)
        finally:
            cur.close()
        raw_conn.commit()
    finally:
        raw_conn.close()


def merge_to_final() -> None:
    merge_sql = MERGE_FILE.read_text(encoding="utf-8")
    execute_sql_script(merge_sql)


def download_sp500_daily(start: str, end: str | None) -> pd.DataFrame:
    symbols = load_sp500_symbols()
    raw = yf.download(
        tickers=symbols,
        start=start,
        end=end,
        interval="1d",
        auto_adjust=False,
        actions=False,
        group_by="ticker",
        threads=True,
        progress=False,
    )
    if raw is None:
        return pd.DataFrame()
    return normalize_download(raw, symbols)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Load S&P 500 daily OHLCV from yfinance into Postgres.")
    parser.add_argument("--start", default="2000-01-01", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", default=None, help="End date (YYYY-MM-DD)")
    parser.add_argument(
        "--stage-mode",
        choices=["to_sql", "copy"],
        default="to_sql",
        help="Staging method. Use to_sql first, then switch to copy for faster large loads.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    run_ddl()
    data = download_sp500_daily(start=args.start, end=args.end)

    if data.empty:
        print("No rows returned from yfinance.")
        return

    duplicate_count = data.duplicated(subset=["symbol", "ts"]).sum()
    if duplicate_count:
        data = data.drop_duplicates(subset=["symbol", "ts"], keep="last")

    if args.stage_mode == "copy":
        stage_with_copy(data)
    else:
        stage_with_to_sql(data)

    merge_to_final()

    print(
        f"Loaded {len(data):,} rows from yfinance into market_data.prices_daily "
        f"(stage_mode={args.stage_mode})."
    )


if __name__ == "__main__":
    main()
