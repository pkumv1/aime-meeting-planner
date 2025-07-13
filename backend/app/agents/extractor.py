# backend/app/agents/extractor.py
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
import json
import json5
import re
import os
from typing import Dict, Optional

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.2
)

async def extractor_agent(email_text: str) -> Optional[Dict]:
    """Extract meeting information from email text"""
    
    prompt = ChatPromptTemplate.from_template("""You are an expert AI assistant specialized in extracting meeting and event information from emails. Your task is to carefully analyze the provided email and extract specific information with high accuracy.

EXTRACTION REQUIREMENTS:
Extract the following fields and return them as a valid JSON object. Be very careful to extract information accurately and handle various formats.

REQUIRED FIELDS:
1. "full_name": Contact person's complete name (First + Last name)
2. "email": Valid email address of the contact person
3. "phone": Phone number in any format (include country code if mentioned)
4. "location": Event venue, city, state/country (be as specific as possible)
5. "event_name": Official name or title of the event/meeting
6. "event_type": Type of event (conference, meeting, seminar, training, workshop, corporate event, etc.)
7. "number_of_attendees": Total expected participants (extract numbers only, convert words to numbers)
8. "number_of_sleeping_rooms": Hotel rooms needed for overnight stays (extract numbers only)
9. "budget": Budget amount with currency if mentioned (e.g., "$50000", "€25000", "25K USD")
10. "event_start_date": Start date in YYYY-MM-DD format
11. "event_end_date": End date in YYYY-MM-DD format

EXTRACTION RULES:
- If information is not found, set the field to null
- For dates: Convert any date format to YYYY-MM-DD (e.g., "March 15, 2024" → "2024-03-15")
- For numbers: Extract only numeric values (e.g., "fifty people" → 50, "around 100" → 100)
- For budget: Keep original format with currency symbols
- For location: Include city, state/country if mentioned
- For names: Extract the person making the request, not company names
- For emails: Extract the sender's email or any contact email mentioned
- Handle variations like "approx", "around", "about" for attendee numbers
- If multiple dates mentioned, use the main event dates

IMPORTANT FORMATTING:
- Return ONLY valid JSON format
- Use double quotes for all strings
- Use null (not "null", "N/A", or empty strings) for missing values
- Ensure proper JSON syntax with correct brackets and commas

EMAIL TO ANALYZE:
{text}

RESPONSE: Return only the JSON object, no additional text or explanations.""")
    
    try:
        output = llm(prompt.format_messages(text=email_text)).content.strip()
        cleaned = output.replace("```json", "").replace("```", "").strip()
        
        # Try to parse JSON
        try:
            return json5.loads(cleaned)
        except Exception:
            # Try to extract JSON from response
            match = re.search(r'\{.*?\}', cleaned, re.DOTALL)
            if match:
                try:
                    return json5.loads(match.group(0))
                except Exception:
                    pass
        
        return None
        
    except Exception as e:
        print(f"Extraction error: {str(e)}")
        return None
