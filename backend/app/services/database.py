# backend/app/services/database.py
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.models.database import SessionLocal, VenueLead
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def save_to_db(event_id: str, fields: Dict, round_number: int = 1) -> bool:
    """Save event data to database"""
    try:
        db = SessionLocal()
        primary_id = f"{event_id}_{round_number}"
        
        # Parse budget
        budget = None
        if fields.get("budget"):
            budget_str = str(fields["budget"]).replace("$", "").replace("€", "").replace(",", "")
            budget_str = budget_str.replace("K", "000").replace("k", "000")
            try:
                budget = float(budget_str)
            except:
                pass
        
        # Parse dates
        start_date = None
        end_date = None
        if fields.get("event_start_date"):
            try:
                start_date = datetime.strptime(fields["event_start_date"], "%Y-%m-%d")
            except:
                pass
        
        if fields.get("event_end_date"):
            try:
                end_date = datetime.strptime(fields["event_end_date"], "%Y-%m-%d")
            except:
                pass
        
        # Check if all fields are complete
        required_fields = [
            "full_name", "email", "phone", "location", "event_name",
            "event_type", "number_of_attendees", "number_of_sleeping_rooms",
            "budget", "event_start_date", "event_end_date"
        ]
        is_complete = all(fields.get(field) for field in required_fields)
        
        # Create venue lead record
        venue_lead = VenueLead(
            primaryid=primary_id,
            event_id=event_id,
            round_number=round_number,
            full_name=fields.get("full_name"),
            email=fields.get("email"),
            phone=fields.get("phone"),
            location=fields.get("location"),
            event_name=fields.get("event_name"),
            event_type=fields.get("event_type"),
            number_of_attendees=fields.get("number_of_attendees"),
            number_of_sleeping_rooms=fields.get("number_of_sleeping_rooms"),
            budget=budget,
            event_start_date=start_date,
            event_end_date=end_date,
            is_complete=is_complete
        )
        
        db.add(venue_lead)
        db.commit()
        db.close()
        
        logger.info(f"Successfully saved event {event_id} round {round_number}")
        return True
        
    except Exception as e:
        logger.error(f"Database save error: {str(e)}")
        if db:
            db.rollback()
            db.close()
        return False

async def get_event_data(event_id: str) -> Optional[Dict]:
    """Get the latest event data by event_id"""
    try:
        db = SessionLocal()
        
        # Get the latest round for this event
        latest_record = db.query(VenueLead).filter(
            VenueLead.event_id == event_id
        ).order_by(VenueLead.round_number.desc()).first()
        
        if not latest_record:
            return None
        
        # Convert to dictionary
        data = {
            "event_id": latest_record.event_id,
            "full_name": latest_record.full_name,
            "email": latest_record.email,
            "phone": latest_record.phone,
            "location": latest_record.location,
            "event_name": latest_record.event_name,
            "event_type": latest_record.event_type,
            "number_of_attendees": latest_record.number_of_attendees,
            "number_of_sleeping_rooms": latest_record.number_of_sleeping_rooms,
            "budget": f"${latest_record.budget:,.2f}" if latest_record.budget else None,
            "event_start_date": latest_record.event_start_date.strftime("%Y-%m-%d") if latest_record.event_start_date else None,
            "event_end_date": latest_record.event_end_date.strftime("%Y-%m-%d") if latest_record.event_end_date else None,
            "round_number": latest_record.round_number,
            "is_complete": latest_record.is_complete
        }
        
        db.close()
        return data
        
    except Exception as e:
        logger.error(f"Database fetch error: {str(e)}")
        if db:
            db.close()
        return None