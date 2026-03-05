BEGIN;

INSERT INTO market_data.historical_stockdata_daily (
    symbol,
    ts,
    open,
    high,
    low,
    close,
    volume,
    dividends,
    stock_splits,
    adj_close
)
SELECT
    s.symbol,
    s.ts,
    s.open,
    s.high,
    s.low,
    s.close,
    s.volume,
    s.dividends,
    s.stock_splits,
    s.adj_close
FROM market_data.staging_historical_stockdata_daily s
WHERE s.symbol IS NOT NULL
  AND s.ts IS NOT NULL
  AND (s.high IS NULL OR s.low IS NULL OR s.high >= s.low)
  AND (s.volume IS NULL OR s.volume >= 0)
ON CONFLICT (symbol, ts)
DO UPDATE SET
    open = EXCLUDED.open,
    high = EXCLUDED.high,
    low = EXCLUDED.low,
    close = EXCLUDED.close,
    adj_close = EXCLUDED.adj_close,
    volume = EXCLUDED.volume,
    dividends = EXCLUDED.dividends,
    stock_splits = EXCLUDED.stock_splits;

WITH bad AS (
    SELECT
        s.*,
        CASE
            WHEN s.high IS NOT NULL AND s.low IS NOT NULL AND s.high < s.low THEN 'high_is_wrong'
            WHEN s.volume IS NOT NULL AND s.volume < 0 THEN 'volume_is_wrong'
            ELSE 'validation_failed'
        END AS err_code,
        row_to_json(s)::jsonb AS raw_payload
    FROM market_data.staging_historical_stockdata_daily s
    WHERE (s.high IS NOT NULL AND s.low IS NOT NULL AND s.high < s.low)
       OR (s.volume IS NOT NULL AND s.volume < 0)
)
INSERT INTO market_data.historical_stockdata_daily_failed (
    symbol,
    ts,
    open,
    high,
    low,
    close,
    volume,
    dividends,
    stock_splits,
    adj_close,
    error_reason,
    error_detail,
    raw_payload,
    first_failed_at
)
SELECT
    symbol,
    ts,
    open,
    high,
    low,
    close,
    volume,
    dividends,
    stock_splits,
    adj_close,
    err_code,
    NULL,
    raw_payload,
    NOW()
FROM bad;

TRUNCATE market_data.staging_historical_stockdata_daily;
COMMIT;