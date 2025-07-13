# backend/app/core/languages.py
"""
Language configurations and email templates for AIME Meeting Planner
"""

LANGUAGE_CONFIG = {
    "English": {
        "voice": "en-US-AriaNeural",
        "prompts": {
            "full_name": "What's your full name?",
            "email": "Your email address?",
            "phone": "Your phone number?",
            "location": "Where is the event?",
            "event_name": "Event name?",
            "event_type": "Event type?",
            "number_of_attendees": "How many attendees?",
            "number_of_sleeping_rooms": "Sleeping rooms needed?",
            "budget": "Do you have a budget?",
            "event_start_date": "What is the event start date?",
            "event_end_date": "What is the event end date?"
        },
        "templates": {
            "thank_you": """Hi {full_name},

Thank you for providing all the details for your upcoming event! We have received complete information about your {event_name} and are excited to help you create an outstanding experience.

Here's a summary of what we have:
Event: {event_name} ({event_type})
Location: {location}
Attendees: {number_of_attendees} people
Hotel Rooms: {number_of_sleeping_rooms} rooms
Budget: {budget}
Dates: {event_start_date} to {event_end_date}

Our team is already working on finding the perfect venue options that match your requirements and budget. You can expect to receive our curated venue recommendations within 24 hours.

We'll include detailed information about each venue, pricing options, availability, and special packages that align with your event needs.

Thank you for choosing AMEX Meetings & Events. We look forward to making your event a tremendous success!

Warm regards,
Amy
Meeting Planner Agent – AMEX Meetings & Events""",

            "followup": """Hi {full_name},

Thank you for your {event_type} request! I'm excited to help you organize a successful event.

To provide you with the best venue recommendations, I need a few additional details:

{missing_list}

Could you please provide the following information:

{questions}

Optional Services:
Would you also like assistance with any of these services?
- Creating a Registration Website
- Sending Registration Invitations
- Building an Attendee App
- Booking Air Travel
- Coordinating Ground Transportation
- Planning Optional Activities (dinners, tours, excursions)
- Onsite Check-in & Event Support

Once I have this information, I'll send you tailored venue options and planning recommendations.

Looking forward to your response!

Warm regards,
Amy
Meeting Planner Agent – AMEX Meetings & Events""",

            "partial_followup": """Hi {full_name},

Thank you for providing additional information about your {event_name}!

I still need a few more details to complete your venue search:

{missing_list}

Please provide:

{questions}

Once I have these final details, I'll be able to send you comprehensive venue recommendations that perfectly match your requirements.

Thank you for your patience!

Best regards,
Amy
Meeting Planner Agent – AMEX Meetings & Events"""
        }
    },
    
    "Spanish": {
        "voice": "es-ES-ElviraNeural",
        "prompts": {
            # Add Spanish prompts here
        },
        "templates": {
            # Add Spanish templates here
        }
    },
    
    "German": {
        "voice": "de-DE-KatjaNeural",
        "prompts": {
            # Add German prompts here
        },
        "templates": {
            # Add German templates here
        }
    },
    
    "French": {
        "voice": "fr-FR-DeniseNeural",
        "prompts": {
            # Add French prompts here
        },
        "templates": {
            # Add French templates here
        }
    }
}