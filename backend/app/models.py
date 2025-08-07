from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Holding(Base):
    __tablename__ = 'holdings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    symbol = Column(String)
    company_name = Column(String)
    quantity = Column(Integer)
    avg_price = Column(Float)
    current_price = Column(Float)
    sector = Column(String)
    market_cap = Column(String)
    exchange = Column(String)
    value = Column(Float)
    gain_loss = Column(Float)
    gain_loss_percent = Column(Float)

class HistoricalPerformance(Base):
    __tablename__ = 'historical_performance'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date)
    portfolio_value = Column(Float)
    nifty_50 = Column(Float)
    gold = Column(Float)
    portfolio_return = Column(Float)
    nifty_50_return = Column(Float)
    gold_return = Column(Float)