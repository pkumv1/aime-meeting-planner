# backend/app/models/database.py
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class VenueLead(Base):
    __tablename__ = "venueleads"
    
    primaryid = Column(String, primary_key=True)
    event_id = Column(String, nullable=False, index=True)
    round_number = Column(Integer, default=1)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    location = Column(String)
    event_name = Column(String)
    event_type = Column(String)
    number_of_attendees = Column(Integer)
    number_of_sleeping_rooms = Column(Integer)
    budget = Column(Float)
    event_start_date = Column(DateTime)
    event_end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_complete = Column(Boolean, default=False)

# Database connection
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:sathish@localhost:5433/sathishdb"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)