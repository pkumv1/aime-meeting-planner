# backend/app/main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

app = FastAPI(title="AIME Meeting Planner API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class EmailRequest(BaseModel):
    email_content: str
    language: str = "English"

class ReplyRequest(BaseModel):
    event_id: str
    reply_content: str
    round_number: int

class EventData(BaseModel):
    event_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    event_name: Optional[str] = None
    event_type: Optional[str] = None
    number_of_attendees: Optional[int] = None
    number_of_sleeping_rooms: Optional[int] = None
    budget: Optional[str] = None
    event_start_date: Optional[str] = None
    event_end_date: Optional[str] = None

class ProcessingResponse(BaseModel):
    event_id: str
    extracted_data: EventData
    missing_fields: List[str]
    followup_email: str
    is_complete: bool
    round_number: int
    attachments: List[str]

class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "English"

# Import agent functions from separate modules
from app.agents.extractor import extractor_agent
from app.agents.validator import validator_agent
from app.agents.communicator import communicator_agent
from app.agents.reply_extractor import reply_extractor_agent
from app.services.database import save_to_db, get_event_data
from app.services.tts import TextToSpeechService

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/process-email", response_model=ProcessingResponse)
async def process_email(request: EmailRequest):
    """Process initial meeting request email"""
    try:
        # Generate event ID
        event_id = f"REQ-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # Extract information
        extracted_data = await extractor_agent(request.email_content)
        if not extracted_data:
            raise HTTPException(status_code=400, detail="Failed to extract information from email")
        
        # Validate and find missing fields
        missing_fields = validator_agent(extracted_data)
        
        # Generate follow-up email
        followup_email = communicator_agent(
            missing_fields, 
            event_id, 
            extracted_data, 
            round_number=1,
            language=request.language
        )
        
        # Save to database
        success = await save_to_db(event_id, extracted_data, round_number=1)
        if not success:
            raise HTTPException(status_code=500, detail="Database save failed")
        
        # Check for attachments
        attachments = extract_attachments(request.email_content)
        
        return ProcessingResponse(
            event_id=event_id,
            extracted_data=EventData(**extracted_data),
            missing_fields=missing_fields,
            followup_email=followup_email,
            is_complete=len(missing_fields) == 0,
            round_number=1,
            attachments=attachments
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-reply", response_model=ProcessingResponse)
async def process_reply(request: ReplyRequest):
    """Process client reply email"""
    try:
        # Get existing event data
        existing_data = await get_event_data(request.event_id)
        if not existing_data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Get current missing fields
        missing_fields = validator_agent(existing_data)
        
        # Extract new information from reply
        reply_data = await reply_extractor_agent(request.reply_content, missing_fields)
        
        # Merge data
        updated_data = merge_event_data(existing_data, reply_data)
        
        # Check what's still missing
        new_missing_fields = validator_agent(updated_data)
        
        # Generate appropriate email
        new_round = request.round_number + 1
        followup_email = communicator_agent(
            new_missing_fields,
            request.event_id,
            updated_data,
            round_number=new_round
        )
        
        # Save updated data
        success = await save_to_db(request.event_id, updated_data, round_number=new_round)
        if not success:
            raise HTTPException(status_code=500, detail="Database save failed")
        
        return ProcessingResponse(
            event_id=request.event_id,
            extracted_data=EventData(**updated_data),
            missing_fields=new_missing_fields,
            followup_email=followup_email,
            is_complete=len(new_missing_fields) == 0,
            round_number=new_round,
            attachments=[]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    """Generate speech from text"""
    tts_service = TextToSpeechService()
    audio_data = await tts_service.generate_speech(request.text, request.language)
    
    if audio_data:
        return {"audio_base64": audio_data}
    else:
        raise HTTPException(status_code=500, detail="Failed to generate speech")

@app.get("/api/events/{event_id}")
async def get_event(event_id: str):
    """Get event details by ID"""
    event_data = await get_event_data(event_id)
    if not event_data:
        raise HTTPException(status_code=404, detail="Event not found")
    return event_data

def extract_attachments(email_text: str) -> List[str]:
    """Extract attachment references from email"""
    import re
    return list(set(re.findall(r'[\w,\s-]+\.(pdf|docx|xlsx|pptx|txt|zip)', email_text, re.IGNORECASE)))

def merge_event_data(existing: Dict, new: Dict) -> Dict:
    """Merge new data with existing data"""
    merged = existing.copy()
    for key, value in new.items():
        if value and str(value).strip().lower() not in ["", "n/a", "none", "null"]:
            merged[key] = value
    return merged
