CREATE TABLE IF NOT EXISTS market_data.company_profile (
symbol VARCHAR(20) PRIMARY KEY,
short_name TEXT,
long_name TEXT,
quote_type TEXT,
exchange TEXT,
currency TEXT,
website TEXT,
sector TEXT,
industry TEXT,
country TEXT,
city TEXT,
state TEXT,
full_time_employees BIGINT,
long_business_summary TEXT,
market_cap NUMERIC(20,0),
enterprise_value NUMERIC(20,0),
total_revenue NUMERIC(20,0),
ebitda NUMERIC(20,0),
revenue_growth NUMERIC(12,6),
gross_margins NUMERIC(12,6),
operating_margins NUMERIC(12,6),
profit_margins NUMERIC(12,6),
free_cashflow NUMERIC(20,0),
trailing_pe NUMERIC(14,6),
forward_pe NUMERIC(14,6),
peg_ratio NUMERIC(14,6),
price_to_book NUMERIC(14,6),
trailing_eps NUMERIC(14,6),
forward_eps NUMERIC(14,6),
return_on_equity NUMERIC(14,6),
return_on_assets NUMERIC(14,6),
debt_to_equity NUMERIC(14,6),
current_ratio NUMERIC(14,6),
quick_ratio NUMERIC(14,6),
dividend_rate NUMERIC(14,6),
dividend_yield NUMERIC(14,6),
payout_ratio NUMERIC(14,6),
ex_dividend_date TIMESTAMPTZ,
beta NUMERIC(14,6),
shares_outstanding NUMERIC(20,0),
average_volume NUMERIC(20,0),
fifty_two_week_high NUMERIC(14,6),
fifty_two_week_low NUMERIC(14,6),
fifty_day_average NUMERIC(14,6),
two_hundred_day_average NUMERIC(14,6),
source_created_at TIMESTAMPTZ,
loaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_data.financials(
    symbol VARCHAR (20),
    year INT NOT NULL,
    PRIMARY KEY (symbol, year)

);

CREATE INDEX IF NOT EXISTS idx_industry ON market_data.company_profile(industry);

CREATE INDEX IF NOT EXISTS idx_symbol_industry on market_data.company_profile(symbol, industry);

CREATE INDEX IF NOT EXISTS idx_symbol_sector on market_data.company_profile(symbol,sector)