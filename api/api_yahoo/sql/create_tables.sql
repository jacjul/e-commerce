CREATE SCHEMA IF NOT EXISTS market_data; 

CREATE TABLE IF NOT EXISTS market_data.staging_historical_stockdata_daily(
    symbol VARCHAR(20) NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    open NUMERIC(10,6),
    high NUMERIC(10,6), 
    low NUMERIC(10,6),
    close NUMERIC(10,6), 
    volume BIGINT,
    dividends DOUBLE PRECISION, 
    stock_splits DOUBLE PRECISION, 
    adj_close DOUBLE PRECISION ,
    PRIMARY KEY (symbol, ts)
);

CREATE TABLE IF NOT EXISTS market_data.historical_stockdata_daily(
    symbol VARCHAR(20) NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    open NUMERIC(10,6),
    high NUMERIC(10,6), 
    low NUMERIC(10,6),
    close NUMERIC(10,6), 
    volume BIGINT,
    dividends DOUBLE PRECISION, 
    stock_splits DOUBLE PRECISION, 
    adj_close DOUBLE PRECISION ,
    PRIMARY KEY (symbol,ts),
    CONSTRAINT highest_val_correct CHECK 
        (high IS NULL OR (open IS NULL OR high >= open) AND (close IS NULL OR high >= close)),
    CONSTRAINT lowest_val_correct CHECK 
        (low IS NULL OR (open IS NULL OR low <= open) AND (close IS NULL OR low <= close)),
    CONSTRAINT volume_correct CHECK (volume IS NULL OR volume >= 0)
);

CREATE TABLE IF NOT EXISTS market_data.historical_stockdata_daily_failed (
symbol VARCHAR(20),
ts TIMESTAMPTZ,
open NUMERIC(10,6),
high NUMERIC(10,6),
low NUMERIC(10,6),
close NUMERIC(10,6),
volume BIGINT,
dividends DOUBLE PRECISION,
stock_splits DOUBLE PRECISION,
adj_close DOUBLE PRECISION,
error_reason TEXT NOT NULL, -- short machine-friendly code
error_detail TEXT, -- free text / validation message
raw_payload JSONB, -- original row as JSON for debugging
first_failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
last_attempt_at TIMESTAMPTZ,
attempt_count INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prices_daily_symbol_ts_desc 
    ON market_data.historical_stockdata_daily(symbol, ts DESC);

CREATE INDEX IF NOT EXISTS idx_prices_daily_ts_desc
ON market_data.historical_stockdata_daily(ts);

CREATE INDEX IF NOT EXISTS idx_failed_first_failed_at_desc
ON market_data.historical_stockdata_daily_failed(first_failed_at DESC);

CREATE INDEX IF NOT EXISTS idx_failed_error_reason
ON market_data.historical_stockdata_daily_failed(error_reason);