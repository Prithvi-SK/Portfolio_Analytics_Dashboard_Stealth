from pydantic import BaseModel
from datetime import date

# Pydantic models for response validation
class HoldingSchema(BaseModel):
    symbol: str
    company_name: str
    quantity: int
    avg_price: float
    current_price: float
    sector: str
    market_cap: str
    exchange: str
    value: float
    gain_loss: float
    gain_loss_percent: float

    class Config:
        from_attributes = True  # maps sqlalchemy objects to pydantic json 

class HistoricalPerformanceSchema(BaseModel):
    date: date  # Dates will be serialized as strings
    portfolio_value: float
    nifty_50: float
    gold: float
    portfolio_return: float
    nifty_50_return: float
    gold_return: float

    class Config:
        from_attributes = True

class SectorAllocationSchema(BaseModel):
    sector: str
    value: float
    percentage: float
    holdingsCount: int

class MarketCapSchema(BaseModel):
    marketCap: str
    value: float
    percentage: float
    holdingsCount: int

class TopPerformersSchema(BaseModel):
    bestPerformer: dict
    worstPerformer: dict