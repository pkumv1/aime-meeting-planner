# backend/app/agents/communicator.py
from typing import List, Dict, Optional
from app.core.languages import LANGUAGE_CONFIG

def communicator_agent(
    missing_fields: List[str], 
    event_id: str, 
    fields: Dict[str, any], 
    round_number: int = 1,
    language: str = "English"
) -> str:
    """Generate appropriate email based on missing fields and language"""
    
    lang_config = LANGUAGE_CONFIG.get(language, LANGUAGE_CONFIG["English"])
    
    # Extract full name properly - handle "Priya Sharma" format
    full_name = fields.get("full_name", "Guest")
    if full_name and " " in full_name:
        # Use first name for greeting but keep full name for records
        first_name = full_name.split()[0]
    else:
        first_name = full_name
    
    event_name = fields.get("event_name", "your event")
    event_type = fields.get("event_type", "event")
    
    # If no missing fields, generate thank you email
    if not missing_fields:
        return lang_config["templates"]["thank_you"].format(
            full_name=first_name,  # Use first name in greeting
            event_name=event_name,
            event_type=event_type,
            location=fields.get("location", "TBD"),
            number_of_attendees=fields.get("number_of_attendees", "TBD"),
            number_of_sleeping_rooms=fields.get("number_of_sleeping_rooms", "TBD"),
            budget=fields.get("budget", "TBD"),
            event_start_date=fields.get("event_start_date", "TBD"),
            event_end_date=fields.get("event_end_date", "TBD")
        )
    
    # Format missing fields for display with bullet points
    missing_list = "\n".join([f"• {field.replace('_', ' ').title()}" for field in missing_fields])
    
    # Generate questions based on language
    questions = "\n".join(
        f"- {lang_config['prompts'].get(field, field.replace('_', ' ').capitalize() + '?')}"
        for field in missing_fields
    )
    
    # Choose template based on round number
    if round_number == 1:
        template_key = "followup"
    else:
        template_key = "partial_followup"
    
    return lang_config["templates"][template_key].format(
        full_name=first_name,  # Use first name in greeting
        event_name=event_name,
        event_type=event_type,
        missing_list=missing_list,
        questions=questions
    )