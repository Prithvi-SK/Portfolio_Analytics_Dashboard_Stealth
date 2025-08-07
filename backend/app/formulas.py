from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models import Holding, HistoricalPerformance
from typing import List, Dict
import math

def total_value_calc(db: Session) -> float:
    return db.query(func.sum(Holding.value)).scalar() or 0

def total_invested_calc(db: Session) -> float:
    return db.query(func.sum(Holding.quantity * Holding.avg_price)).scalar() or 0

def gain_loss_calc(total_value: float, total_invested: float) -> float:
    return total_value - total_invested

def gain_loss_percent_calc(gain_loss: float, total_invested: float) -> float:
    return gain_loss / total_invested if total_invested != 0 else 0

def number_of_holdings_calc(db: Session) -> int:
    return db.query(Holding).count()

def diversification_score_calc(db: Session, total_value: float) -> float:
    # Get sector allocations
    sectors = db.query(
        Holding.sector,
        func.sum(Holding.value).label('value')
    ).group_by(Holding.sector).all()

    # Calculate HHI
    hhi = 0
    for sector in sectors:
        sector_percentage = (sector.value / total_value * 100) if total_value else 0
        hhi += sector_percentage ** 2

    # Normalize HHI to Diversification Score (0-10)
    num_sectors = len(sectors)
    num_holdings = db.query(Holding).count()
    hhi_min = (100 ** 2) / num_sectors if num_sectors > 0 else 10000  # Perfect diversification
    hhi_max = 10000  # Max concentration (one sector)
    diversification_score = 10 * (1 - (hhi - hhi_min) / (hhi_max - hhi_min)) if hhi_max != hhi_min else 0

    # Adjust score for number of holdings and sectors
    if num_holdings < 15:
        diversification_score -= 0.5  # Penalty for fewer holdings
    if num_sectors < 6:
        diversification_score -= 0.5  # Penalty for fewer sectors
    return max(0, min(10, round(diversification_score, 1)))  # Ensure 0-10 range

def risk_level_calc(db: Session, total_value: float) -> str:
    # Sector betas (approximations for NSE large-cap stocks)
    sector_betas = {
        "Technology": 1.2,
        "Automotive": 1.1,
        "Banking": 1.0,
        "Financial Services": 1.1,
        "Energy": 0.9,
        "Consumer Discretionary": 1.0,
        "Telecommunications": 0.9,
        "Consumer Goods": 0.8,
        "Healthcare": 0.7
    }

    # Estimate portfolio beta based on sector weights
    sectors = db.query(
        Holding.sector,
        func.sum(Holding.value).label('value')
    ).group_by(Holding.sector).all()
    portfolio_beta = 0
    for sector in sectors:
        sector_weight = (sector.value / total_value) if total_value else 0
        beta = sector_betas.get(sector.sector, 1.0)  # Default beta = 1.0
        portfolio_beta += sector_weight * beta

    # Check market cap (large-cap reduces risk)
    large_cap_percentage = db.query(func.sum(Holding.value)).filter(Holding.market_cap == "Large").scalar() or 0
    large_cap_weight = large_cap_percentage / total_value if total_value else 0

    # Calculate volatility (standard deviation) from HistoricalPerformance
    returns = db.query(HistoricalPerformance.portfolio_return).all()
    if returns:
        returns = [r[0] for r in returns]  # Extract returns
        mean_return = sum(returns) / len(returns) if returns else 0
        variance = sum((r - mean_return) ** 2 for r in returns) / (len(returns) - 1) if len(returns) > 1 else 0
        volatility = pow(variance,0.5) * 100  # Annualized std dev (%)
    else:
        volatility = 10  # Default assumption if no historical data

    # Assign risk level
    if portfolio_beta < 0.8 and volatility < 5 and large_cap_weight > 0.9:
        return "Low"
    elif portfolio_beta > 1.5 or volatility > 15 or large_cap_weight < 0.5:
        return "High"
    else:
        return "Moderate"

def sector_allocation_calc(db: Session, total_value: float) -> List[Dict]:
    sectors = db.query(
        Holding.sector,
        func.sum(Holding.value).label('value'),
        func.count().label('count')
    ).group_by(Holding.sector).all()
    return [
        {
            "sector": s.sector,
            "value": s.value,
            "percentage": s.value / total_value if total_value else 0,
            "holdingsCount": s.count
        } for s in sectors
    ]

def market_cap_allocation_calc(db: Session, total_value: float) -> List[Dict]:
    market_caps = db.query(
        Holding.market_cap,
        func.sum(Holding.value).label('value'),
        func.count().label('count')
    ).group_by(Holding.market_cap).all()
    return [
        {
            "marketCap": m.market_cap,
            "value": m.value,
            "percentage": m.value / total_value if total_value else 0,
            "holdingsCount": m.count
        } for m in market_caps
    ]

def top_performers_calc(db: Session) -> Dict:
    best = db.query(Holding).order_by(Holding.gain_loss_percent.desc()).first()
    worst = db.query(Holding).order_by(Holding.gain_loss_percent.asc()).first()
    return {
        "bestPerformer": {
            "symbol": best.symbol if best else None,
            "name": best.company_name if best else None,
            "gainPercent": best.gain_loss_percent if best else None
        },
        "worstPerformer": {
            "symbol": worst.symbol if worst else None,
            "name": worst.company_name if worst else None,
            "gainPercent": worst.gain_loss_percent if worst else None
        }
    }