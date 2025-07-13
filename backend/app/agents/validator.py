# backend/app/agents/validator.py
from typing import Dict, List

def validator_agent(fields: Dict[str, any]) -> List[str]:
    """Validate fields and return list of missing required fields"""
    
    required_fields = [
        "full_name",
        "email", 
        "phone",
        "location",
        "event_name",
        "event_type",
        "number_of_attendees",
        "number_of_sleeping_rooms",
        "budget",
        "event_start_date",
        "event_end_date"
    ]
    
    missing = []
    for field in required_fields:
        value = fields.get(field)
        if not value or str(value).strip().lower() in ["", "n/a", "none", "null"]:
            missing.append(field)
    
    return missing