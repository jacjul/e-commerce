from api.core.database import Base
from sqlalchemy import String, Text, BigInteger, Numeric, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Dict
from datetime import datetime

class StockDataInfoStaging(Base):
    __tablename__ = "info"
    __table_args__ ={"schema":"market_data"}

    symbol: Mapped[str] = mapped_column(String(10),primary_key = True)
    jsondump : Mapped[Dict[str,str]] = mapped_column(JSONB)
    created_at : Mapped[datetime] = mapped_column(server_default =func.now())


class StockDataCompanyProfile(Base):
    __tablename__ = "company_profile"
    __table_args__ = {"schema": "market_data"}

    symbol: Mapped[str] = mapped_column(String(20), primary_key=True)
    short_name: Mapped[str | None] = mapped_column(Text)
    long_name: Mapped[str | None] = mapped_column(Text)
    quote_type: Mapped[str | None] = mapped_column(Text)
    exchange: Mapped[str | None] = mapped_column(Text)
    currency: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(Text)
    sector: Mapped[str | None] = mapped_column(Text)
    industry: Mapped[str | None] = mapped_column(Text)
    country: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(Text)
    state: Mapped[str | None] = mapped_column(Text)
    full_time_employees: Mapped[int | None] = mapped_column(BigInteger)
    long_business_summary: Mapped[str | None] = mapped_column(Text)

    market_cap: Mapped[float | None] = mapped_column(Numeric(20, 0))
    enterprise_value: Mapped[float | None] = mapped_column(Numeric(20, 0))
    total_revenue: Mapped[float | None] = mapped_column(Numeric(20, 0))
    ebitda: Mapped[float | None] = mapped_column(Numeric(20, 0))

    revenue_growth: Mapped[float | None] = mapped_column(Numeric(12, 6))
    gross_margins: Mapped[float | None] = mapped_column(Numeric(12, 6))
    operating_margins: Mapped[float | None] = mapped_column(Numeric(12, 6))
    profit_margins: Mapped[float | None] = mapped_column(Numeric(12, 6))

    free_cashflow: Mapped[float | None] = mapped_column(Numeric(20, 0))
    trailing_pe: Mapped[float | None] = mapped_column(Numeric(14, 6))
    forward_pe: Mapped[float | None] = mapped_column(Numeric(14, 6))
    peg_ratio: Mapped[float | None] = mapped_column(Numeric(14, 6))
    price_to_book: Mapped[float | None] = mapped_column(Numeric(14, 6))
    trailing_eps: Mapped[float | None] = mapped_column(Numeric(14, 6))
    forward_eps: Mapped[float | None] = mapped_column(Numeric(14, 6))
    return_on_equity: Mapped[float | None] = mapped_column(Numeric(14, 6))
    return_on_assets: Mapped[float | None] = mapped_column(Numeric(14, 6))
    debt_to_equity: Mapped[float | None] = mapped_column(Numeric(14, 6))
    current_ratio: Mapped[float | None] = mapped_column(Numeric(14, 6))
    quick_ratio: Mapped[float | None] = mapped_column(Numeric(14, 6))
    dividend_rate: Mapped[float | None] = mapped_column(Numeric(14, 6))
    dividend_yield: Mapped[float | None] = mapped_column(Numeric(14, 6))
    payout_ratio: Mapped[float | None] = mapped_column(Numeric(14, 6))

    ex_dividend_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    beta: Mapped[float | None] = mapped_column(Numeric(14, 6))
    shares_outstanding: Mapped[float | None] = mapped_column(Numeric(20, 0))
    average_volume: Mapped[float | None] = mapped_column(Numeric(20, 0))
    fifty_two_week_high: Mapped[float | None] = mapped_column(Numeric(14, 6))
    fifty_two_week_low: Mapped[float | None] = mapped_column(Numeric(14, 6))
    fifty_day_average: Mapped[float | None] = mapped_column(Numeric(14, 6))
    two_hundred_day_average: Mapped[float | None] = mapped_column(Numeric(14, 6))

    source_created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    loaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

