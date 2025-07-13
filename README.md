# AIME Meeting Planner

🤖 AI-powered meeting and event information extraction system with React frontend and FastAPI backend.

## Features

- 🎯 Intelligent email parsing for event details
- 🌐 Multi-language support (English, Spanish, German, French)
- 🔊 Text-to-speech with neural voices
- 📊 Visual progress tracking
- 📧 Smart follow-up email generation
- 💾 PostgreSQL database integration
- 🎨 Modern, responsive UI with Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Groq API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pkumv1/aime-meeting-planner.git
cd aime-meeting-planner
```

2. Setup Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Setup Frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables (see .env.example files)

5. Run development servers:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

## Deployment

### Vercel (Frontend)
1. Import this repository in Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Railway/Render (Backend)
1. Connect to this repository
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, LangChain, Groq AI
- **Database**: PostgreSQL with SQLAlchemy
- **TTS**: Edge-TTS

## License

MIT