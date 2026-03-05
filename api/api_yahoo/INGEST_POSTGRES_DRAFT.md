# S&P500 -> Postgres ingestion draft (yfinance)

This draft implements:

1. Bulk historical daily download from yfinance (`yf.download`) for S&P500 symbols.
2. Staging load into Postgres (`to_sql` default, optional `COPY`).
3. Idempotent merge/upsert into final table with `(symbol, ts)` primary key.

## Files

- `postgres_prices_daily.sql` (schema + indexes)
- `merge_prices_daily.sql` (upsert from staging into final + truncate staging)
- `load_sp500_daily.py` (end-to-end loader)

## Run

From repository root:

```bash
python -m api.api_yahoo.load_sp500_daily --start 2000-01-01 --stage-mode to_sql
```

Optional faster staging mode for large runs:

```bash
python -m api.api_yahoo.load_sp500_daily --start 2000-01-01 --stage-mode copy
```

## Table design (draft)

- `market_data.staging_prices_daily`: raw incoming batch rows.
- `market_data.prices_daily`: cleaned canonical table with primary key `(symbol, ts)`.

## Why this is better than direct to_sql into final table

- Retries are idempotent because upsert key is stable.
- Data validation is centralized before final merge.
- You can inspect staging data before merge if needed.
- You can switch staging method (`to_sql` -> `COPY`) without changing business logic.
