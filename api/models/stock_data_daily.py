from api.core.database import Base 
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime 
from sqlalchemy import String,DateTime,BigInteger,Numeric

class StockDataDaily(Base):
    __tablename__ = "historical_stockdata_daily"
    __table_args__ = {"schema": "market_data"}
    
    symbol: Mapped[str] = mapped_column(String(20), primary_key=True)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True)

    open: Mapped[float | None] = mapped_column(Numeric(10, 6))
    high: Mapped[float | None] = mapped_column(Numeric(10, 6))
    low: Mapped[float | None] = mapped_column(Numeric(10, 6))
    close: Mapped[float | None] = mapped_column(Numeric(10, 6))
    volume: Mapped[int | None] = mapped_column(BigInteger)
    dividends: Mapped[float | None] = mapped_column(Numeric(10, 6))
    stock_splits: Mapped[float | None] = mapped_column(Numeric(10, 6))
    adj_close: Mapped[float | None] = mapped_column(Numeric(10, 6))


"""
        symbol VARCHAR(20) NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    open NUMERIC(10,6),
    high NUMERIC(10,6), 
    low NUMERIC(10,6),
    close NUMERIC(10,6), 
    volume BIGINT,
    dividends DOUBLE PRECISION, 
    stock_splits DOUBLE PRECISION, 
    adj_close DOUBLE PRECISION ,"""