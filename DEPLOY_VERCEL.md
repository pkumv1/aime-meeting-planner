# Vercel Deployment Guide

This guide will help you deploy the AIME Meeting Planner on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Already set up at `https://github.com/pkumv1/aime-meeting-planner`
3. **Backend API**: Deploy the backend separately (Railway, Render, or Heroku recommended)
4. **PostgreSQL Database**: Use Supabase, Neon, or Railway for managed PostgreSQL

## Step 1: Deploy Backend First

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select `pkumv1/aime-meeting-planner`
5. Add these environment variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=your_postgresql_url
   ```
6. Railway will auto-detect the backend and deploy it
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect to `pkumv1/aime-meeting-planner`
4. Set root directory to `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables

## Step 2: Deploy Frontend on Vercel

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Choose `pkumv1/aime-meeting-planner`

2. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

## Step 3: Post-Deployment Setup

1. **Update CORS**
   - Get your Vercel URL (e.g., `https://aime-meeting-planner.vercel.app`)
   - Update backend CORS settings to include your Vercel domain

2. **Test the Application**
   - Visit your Vercel URL
   - Try the sample email to test functionality
   - Check browser console for any errors

## Environment Variables Reference

### Backend (.env)
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ORIGINS=["https://your-app.vercel.app"]
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.railway.app
```

## Troubleshooting

### CORS Errors
- Ensure backend CORS includes your Vercel domain
- Check if API URL in frontend matches backend URL

### Database Connection
- Verify DATABASE_URL format
- Ensure database is accessible from backend host
- Check SSL requirements

### API Errors
- Verify GROQ_API_KEY is valid
- Check backend logs for detailed errors
- Ensure all required packages are installed

## Custom Domain

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update backend CORS to include custom domain

## Monitoring

- **Frontend**: Vercel Analytics (built-in)
- **Backend**: Railway/Render logs
- **Database**: Use provider's monitoring tools

## Support

For issues specific to:
- **Vercel deployment**: [vercel.com/docs](https://vercel.com/docs)
- **Backend issues**: Check Railway/Render documentation
- **Application bugs**: Create an issue on GitHub

## Quick Links

- Frontend URL: `https://aime-meeting-planner.vercel.app`
- Backend URL: `https://your-backend.railway.app`
- GitHub Repo: `https://github.com/pkumv1/aime-meeting-planner`

Happy deploying! 🚀
