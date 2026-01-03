# Voice to Text - Real-time Transcription Frontend

A modern, real-time voice-to-text web application built with Next.js, React, and TypeScript. Record audio from your microphone and get instant transcriptions using AssemblyAI.

## Features

- 🎤 **Real-time Audio Recording** - Record audio directly from your browser's microphone
- 📝 **Multiple Transcription Modes**:
  - **Transcribe**: Basic transcription with language detection
  - **Transcribe Verbose**: Transcription with timestamps and segments
  - **Translate**: Translate speech to English
- 🌍 **Multi-language Support** - Auto-detect or manually select from 12+ languages
- ⚡ **Fast & Responsive** - Modern UI with smooth animations
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- ⌨️ **Keyboard Shortcuts** - Press Space to start/stop recording
- 📋 **Copy & Download** - Easy sharing of transcriptions

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **AssemblyAI** - Speech-to-text API (via backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend server running (see Backend Configuration)
- AssemblyAI API key (configured in backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd baatcheet-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file (optional):
```env
# Backend API URL (defaults to http://localhost:3000)
BACKEND_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Base URL
# Default: http://localhost:3000
BACKEND_API_URL=http://localhost:3000
```

**Note**: The frontend uses Next.js API routes to proxy requests to your backend, avoiding CORS issues. The `BACKEND_API_URL` is used by these API routes, not directly by the frontend.

### Backend Configuration

Your backend should be running and configured with:
- AssemblyAI API key
- Endpoints matching the frontend's expected API structure:
  - `POST /api/voice-to-text/transcribe`
  - `POST /api/voice-to-text/transcribe-verbose`
  - `POST /api/voice-to-text/translate`

## Usage

1. **Select Mode**: Choose between Transcribe, Transcribe Verbose, or Translate
2. **Select Language** (for transcribe modes): Choose a language or use Auto-detect
3. **Start Recording**: Click the microphone button or press Space
4. **Stop Recording**: Click the button again or press Space
5. **View Results**: See your transcription with options to copy or download

## API Response Formats

### Transcribe Response
```json
{
  "success": true,
  "data": {
    "text": "Transcribed text here",
    "language": "en"
  }
}
```

### Transcribe Verbose Response
```json
{
  "success": true,
  "data": {
    "task": "transcribe",
    "language": "en",
    "duration": 10.5,
    "text": "Full transcription text",
    "segments": [
      {
        "id": 0,
        "start": 0.0,
        "end": 2.5,
        "text": "First segment"
      }
    ]
  }
}
```

### Translate Response
```json
{
  "success": true,
  "data": {
    "text": "Translated text in English",
    "language": "en"
  }
}
```

## Project Structure

```
baatcheet-frontend/
├── app/
│   ├── api/                    # Next.js API routes (proxies to backend)
│   │   └── voice-to-text/
│   ├── components/             # React components
│   │   └── VoiceToText.tsx    # Main transcription component
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
└── package.json
```

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

Common issues:
- **429 Quota Errors**: Check your AssemblyAI account and billing
- **CORS Errors**: Should be handled automatically via Next.js API routes
- **Microphone Permission**: Allow microphone access in your browser
- **Backend Connection**: Ensure backend is running and `BACKEND_API_URL` is correct

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## AssemblyAI Notes

- **Free Tier**: 5 hours of transcription per month
- **Pricing**: $0.00025 per second (~$0.90 per hour)
- **Rate Limits**: Vary by plan (check your dashboard)
- **Documentation**: https://www.assemblyai.com/docs

## License

[Your License Here]
