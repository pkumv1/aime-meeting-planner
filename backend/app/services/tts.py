# backend/app/services/tts.py
import edge_tts
import base64
import tempfile
import os
import asyncio
from typing import Optional
from app.core.languages import LANGUAGE_CONFIG

class TextToSpeechService:
    """Service for handling text-to-speech conversion"""
    
    def __init__(self):
        self.voice_mapping = {
            "English": "en-US-AriaNeural",
            "Spanish": "es-ES-ElviraNeural",
            "German": "de-DE-KatjaNeural",
            "French": "fr-FR-DeniseNeural"
        }
    
    async def generate_speech(self, text: str, language: str = "English") -> Optional[str]:
        """
        Generate speech from text and return base64 encoded audio
        
        Args:
            text: The text to convert to speech
            language: The language for speech synthesis
            
        Returns:
            Base64 encoded audio string or None if failed
        """
        if not text or len(text.strip()) < 5:
            return None
        
        try:
            # Clean and prepare text
            clean_text = text.replace('\n\n', '. ').replace('\n', ' ').strip()
            
            # Limit length for better performance
            if len(clean_text) > 600:
                clean_text = clean_text[:600] + "..."
            
            # Get the appropriate voice
            voice = self.voice_mapping.get(language, "en-US-AriaNeural")
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
                temp_path = tmp_file.name
            
            # Generate speech
            communicate = edge_tts.Communicate(clean_text, voice)
            await communicate.save(temp_path)
            
            # Read the file and encode to base64
            with open(temp_path, 'rb') as audio_file:
                audio_data = audio_file.read()
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            # Cleanup
            try:
                os.unlink(temp_path)
            except:
                pass
            
            return audio_base64
            
        except Exception as e:
            print(f"TTS Error: {str(e)}")
            return None