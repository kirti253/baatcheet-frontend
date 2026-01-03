# Port Configuration Guide

## Current Setup

- **Frontend (Next.js)**: Port 3000 (configured)
- **Backend API**: Port 3000 (default in code, but should be different)

## Problem

Both frontend and backend are trying to use port 3000, which causes conflicts. Next.js automatically switches to port 3001 when 3000 is taken.

## Solution Options

### Option 1: Frontend on 3000, Backend on 8000 (Recommended)

**Frontend (Already configured):**
- Runs on port 3000
- Package.json: `"dev": "next dev -p 3000"`

**Backend (You need to change):**
- Change backend to run on port 8000 (or 5000, 4000, etc.)
- Update backend server configuration
- Update `.env.local` in frontend:

```env
BACKEND_API_URL=http://localhost:8000
```

**Why this is recommended:**
- Frontend on 3000 is standard for Next.js
- Backend on 8000 is common for API servers
- Clear separation of concerns

### Option 2: Frontend on 3001, Backend on 3000

**Frontend:**
- Change package.json to: `"dev": "next dev -p 3001"`
- Frontend will be at: http://localhost:3001

**Backend:**
- Keep on port 3000
- No changes needed to BACKEND_API_URL (already defaults to 3000)

## Quick Fix

If you want frontend on 3000 (current setup):

1. **Stop your backend server**
2. **Change your backend to use port 8000** (or another port)
3. **Create/update `.env.local` in frontend:**
   ```env
   BACKEND_API_URL=http://localhost:8000
   ```
4. **Restart frontend**: `npm run dev`
5. **Start backend on new port**

## Verify Configuration

After setup, verify:
- Frontend: http://localhost:3000 (should show your app)
- Backend: http://localhost:8000/api/... (or whatever port you chose)
- Check browser console - API calls should go to the correct backend URL

## Environment Variables

Create `.env.local` in the frontend root:

```env
# Backend API URL (change port if needed)
BACKEND_API_URL=http://localhost:8000
```

The API routes in `app/api/voice-to-text/*/route.ts` use this variable.

