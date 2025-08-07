from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy.sql import func
from datetime import datetime, timedelta, timezone
from typing import List
from app.models import Base, Holding, HistoricalPerformance
from app.database import get_db, engine
from app.schemas import HistoricalPerformanceSchema, HoldingSchema, SectorAllocationSchema, MarketCapSchema, TopPerformersSchema
from app.formulas import (
    total_value_calc,
    total_invested_calc,
    gain_loss_calc,
    gain_loss_percent_calc,
    number_of_holdings_calc,
    diversification_score_calc,
    risk_level_calc,
    sector_allocation_calc,
    market_cap_allocation_calc,
    top_performers_calc
)



router = APIRouter()



@router.get("/api/portfolio/summary")
def get_summary(db: Session = Depends(get_db)):
    try:
        # Calculate summary metrics using formulas.py
        total_value = total_value_calc(db)
        total_invested = total_invested_calc(db)
        gain_loss = gain_loss_calc(total_value, total_invested)
        gain_loss_percent = gain_loss_percent_calc(gain_loss, total_invested)
        number_of_holdings = number_of_holdings_calc(db)
        diversification_score = diversification_score_calc(db, total_value)
        risk_level = risk_level_calc(db, total_value)

        return {
            "totalValue": total_value,
            "totalInvested": total_invested,
            "totalGainLoss": gain_loss,
            "totalGainLossPercent": gain_loss_percent,
            "numberOfHoldings": number_of_holdings,
            "diversificationScore": diversification_score,
            "riskLevel": risk_level
        }
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")



@router.get("/api/portfolio/holdings", response_model=List[HoldingSchema])
def get_holdings(db: Session = Depends(get_db)):
    try:
        holdings = db.query(Holding).all()
        return holdings
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")



@router.get("/api/portfolio/historical-performance", response_model=List[HistoricalPerformanceSchema])
def get_historical_performance(db: Session = Depends(get_db)):
    try:
        performance = db.query(HistoricalPerformance).all()
        return performance
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")



@router.get("/api/portfolio/sector-allocation", response_model=List[SectorAllocationSchema])
def get_sector_allocation(db: Session = Depends(get_db)):
    try:
        total_value = total_value_calc(db)
        return sector_allocation_calc(db, total_value)
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")



@router.get("/api/portfolio/market-cap", response_model=List[MarketCapSchema])
def get_market_cap(db: Session = Depends(get_db)):
    try:
        total_value = total_value_calc(db)
        return market_cap_allocation_calc(db, total_value)
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")



@router.get("/api/portfolio/top-performers", response_model=TopPerformersSchema)
def get_top_performers(db: Session = Depends(get_db)):
    try:
        top_performers = top_performers_calc(db)
        if not top_performers["bestPerformer"]["symbol"] or not top_performers["worstPerformer"]["symbol"]:
            raise HTTPException(status_code=404, detail="No holdings found")
        return top_performers
    
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error")