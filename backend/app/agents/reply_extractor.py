# backend/app/agents/reply_extractor.py
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
import json5
import re
import os
from typing import Dict, List, Optional

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.2
)

async def reply_extractor_agent(reply_text: str, missing_fields: List[str]) -> Optional[Dict]:
    """Extract specific missing information from client reply emails"""
    
    missing_fields_str = ", ".join(missing_fields)
    
    prompt = ChatPromptTemplate.from_template("""You are an expert AI assistant specialized in extracting specific missing information from client reply emails. You need to focus ONLY on the missing fields that were requested in the original follow-up email.

CONTEXT:
The client was asked to provide the following missing information: {missing_fields}

EXTRACTION TASK:
Carefully analyze the reply email and extract ONLY the information related to these missing fields. Be very precise and accurate in your extraction.

RESPONSE FORMAT:
Return ONLY a valid JSON object with the extracted fields. Use null for missing information.

CLIENT REPLY EMAIL:
{text}

RESPONSE: Return only the JSON object, no additional text or explanations.""")
    
    try:
        output = llm(prompt.format_messages(text=reply_text, missing_fields=missing_fields_str)).content.strip()
        cleaned = output.replace("```json", "").replace("```", "").strip()
        
        try:
            return json5.loads(cleaned)
        except Exception:
            match = re.search(r'\{.*?\}', cleaned, re.DOTALL)
            if match:
                try:
                    return json5.loads(match.group(0))
                except Exception:
                    pass
        
        return None
        
    except Exception as e:
        print(f"Reply extraction error: {str(e)}")
        return None