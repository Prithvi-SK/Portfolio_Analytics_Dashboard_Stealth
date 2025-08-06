from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from models import Holding, HistoricalPerformance
from database import get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
    )
