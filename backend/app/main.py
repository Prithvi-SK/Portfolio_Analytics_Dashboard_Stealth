from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models import Base, Holding, HistoricalPerformance
from app.database import get_db, engine
from fastapi.middleware.cors import CORSMiddleware
import time
from sqlalchemy.exc import OperationalError
import pandas as pd
import os
from app import routes

# Initialize database and load data
def parse_percent(value):
    if isinstance(value, str) and value.endswith('%'):
        try:
            return float(value.strip('%')) / 100
        except ValueError:
            return None
    return value


def init_db():

    max_retries = 10
    retry_delay = 1
    
    for attempt in range(max_retries):
        try:
            print(1)
            Base.metadata.create_all(bind=engine)
            print(2)
            with Session(engine) as session:
                print(3)
                if session.query(Holding).count() == 0:
                    print(4)
                    # Initial upload for Holdings table
                    holdings_df = pd.read_excel('Sample_Portfolio_Dataset.xlsx', sheet_name='Holdings')
                    print(5)
                    # Map Excel column names to model column names
                    column_mapping = {
                        'Symbol': 'symbol',
                        'Company Name': 'company_name',
                        'Quantity': 'quantity',
                        'Avg Price ₹': 'avg_price',
                        'Current Price (₹)': 'current_price',
                        'Sector': 'sector',
                        'Market Cap': 'market_cap',
                        'Exchange': 'exchange',
                        'Value ₹': 'value',
                        'Gain/Loss (₹)': 'gain_loss',
                        'Gain/Loss %': 'gain_loss_percent'
                    }
                    
                    for _, row in holdings_df.iterrows():
                        # Convert row to dict and map column names
                        row_dict = row.to_dict()
                        mapped_dict = {}
                        for excel_col, model_col in column_mapping.items():
                            if excel_col in row_dict:
                                val = row_dict[excel_col]
                                # Convert percent fields
                                if excel_col == 'Gain/Loss %':
                                    val = parse_percent(val)

                                mapped_dict[model_col] = val
                        
                        session.add(Holding(**mapped_dict))
                    session.commit()



                print(6)
                if session.query(HistoricalPerformance).count() == 0:
                    #Initial upload for Historical_Performance table
                    print(7)
                    historical_df = pd.read_excel('Sample_Portfolio_Dataset.xlsx', sheet_name='Historical_Performance')
                    # print(historical_df[['Portfolio Return', 'Nifty 50 Return', 'Gold Return']])
                    print(8)
                    # Map Excel column names to model column names for Historical Performance
                    historical_column_mapping = {
                        'Date': 'date',
                        'Portfolio Value (₹)': 'portfolio_value',
                        'Nifty 50': 'nifty_50',
                        'Gold (₹/10g)': 'gold',
                        'Portfolio Return %': 'portfolio_return',
                        'Nifty 50 Return %': 'nifty_50_return',
                        'Gold Return %': 'gold_return'
                    }
                    # print(historical_df[['Portfolio Return', 'Nifty 50 Return', 'Gold Return']])
                    
                    for _, row in historical_df.iterrows():
                        # Convert row to dict and map column names
                        row_dict = row.to_dict()
                        mapped_dict = {}
                        for excel_col, model_col in historical_column_mapping.items():
                            if excel_col in row_dict:
                                val = row_dict[excel_col]
                                # Convert percent fields
                                if excel_col in ['Portfolio Return %', 'Nifty 50 Return %', 'Gold Return %']:
                                    val = parse_percent(val)

                                mapped_dict[model_col] = val
                        
                        session.add(HistoricalPerformance(**mapped_dict))
                    session.commit()
            print("Database initialized successfully!")
            break


        except OperationalError as e:
            if attempt < max_retries - 1:
                print(f"Database connection failed (attempt {attempt + 1}/{max_retries}): {e}")
                time.sleep(retry_delay)
            else:
                print(f"Failed to connect to database after {max_retries} attempts")
                raise e
            
        except Exception as e:
            print(f"Error initializing database: {e}")
            raise e




app = FastAPI()

init_db()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
    )

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}


# All endpoints
app.include_router(routes.router)