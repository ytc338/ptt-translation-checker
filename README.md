# PTT Proofreading & Translation Tool

A full-stack web application for analyzing and proofreading PTT forum posts. The tool separates English source text from Chinese translations, uses Google Cloud Translation API for reference translations, and employs Gemini AI to identify translation errors and inconsistencies.

## Features

- **Source Separation**: Automatically extracts English source text and OP's Chinese translation from PTT posts
- **Google Cloud Translation**: Provides reference translations using Google's translation API
- **AI-Powered Proofreading**: Uses Gemini AI to compare translations and identify errors
- **Progressive Loading**: Displays translation results immediately while proofreading runs in the background
- **Interactive UI**: Click annotations to highlight corresponding text segments
- **History Tracking**: Stores proofreading results in database for future reference

## Tech Stack

### Backend
- **Runtime**: Node.js v20+ with TypeScript v5+
- **Framework**: Express.js
- **AI Services**: 
  - Google Gemini 2.5 Flash Lite (content extraction & proofreading)
  - Google Cloud Translation API (translation)
- **Database**: Prisma ORM (for history tracking)
- **Testing**: Vitest

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern dark theme
- **HTTP Client**: Axios
- **Testing**: Vitest with jsdom

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot-reload enabled for both services

## Prerequisites

- Docker & Docker Compose
- Google Cloud API Key (for Translation API)
- Gemini API Key (for AI proofreading)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ptt-proofreading-SDD
   ```

2. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Usage

1. Enter a PTT forum post URL in the input field
2. Click "Analyze"
3. View the extracted English source and Google's translation immediately
4. Wait for AI proofreading to complete (loading spinner shown)
5. Review annotations highlighting translation errors
6. Click annotations to see highlighted text segments

## API Endpoints

### POST `/api/proofread/translate`
Extracts content and translates English source text.

**Request:**
```json
{
  "url": "https://www.ptt.cc/bbs/..."
}
```

**Response:**
```json
{
  "originalContent": "English source text",
  "translatedContent": "Google translation",
  "opTranslation": "OP's translation",
  "annotations": []
}
```

### POST `/api/proofread/analyze`
Compares translations and generates proofreading annotations.

**Request:**
```json
{
  "englishSource": "...",
  "googleTranslation": "...",
  "opTranslation": "..."
}
```

**Response:**
```json
{
  "annotations": [
    {
      "originalSnippet": "OP's text segment",
      "translatedSnippet": "Corrected text",
      "issueType": "MISTRANSLATION",
      "explanation": "Reason for correction",
      "suggestion": "Alternative phrasing"
    }
  ]
}
```

### GET `/api/proofread/history`
Retrieves proofreading history from database.

## Development

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Code Formatting

```bash
npm run format
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  - Progressive Loading UI           │
│  - Annotation Highlighting          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Backend API (Express)          │
│  ┌─────────────────────────────┐   │
│  │  1. Scrape PTT Post         │   │
│  └────────────┬────────────────┘   │
│               ▼                     │
│  ┌─────────────────────────────┐   │
│  │  2. Extract Content (Gemini)│   │
│  │     - English Source        │   │
│  │     - OP Translation        │   │
│  └────────────┬────────────────┘   │
│               ▼                     │
│  ┌─────────────────────────────┐   │
│  │  3. Translate (Google)      │   │
│  └────────────┬────────────────┘   │
│               ▼                     │
│  ┌─────────────────────────────┐   │
│  │  4. Proofread (Gemini)      │   │
│  │     - Compare translations  │   │
│  │     - Generate annotations  │   │
│  └────────────┬────────────────┘   │
│               ▼                     │
│  ┌─────────────────────────────┐   │
│  │  5. Save to Database        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Project Structure

```
ptt-proofreading-SDD/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   │   └── proofreadController.ts
│   │   │   ├── proofreadRoutes.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── analysisService.ts
│   │   │   ├── aiService.ts
│   │   │   ├── geminiClient.ts
│   │   │   ├── googleTranslationClient.ts
│   │   │   ├── scrapingService.ts
│   │   │   └── prismaClient.ts
│   │   ├── models/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── AnalysisPage.tsx
│   │   ├── components/
│   │   │   ├── TextView.tsx
│   │   │   └── AnnotationList.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yaml
```

## Performance Optimizations

- **Gemini Flash Model**: Uses `gemini-2.5-flash-lite` for faster response times
- **Split API Endpoints**: Separate translation and proofreading for progressive loading
- **Immediate Feedback**: Shows translation results before proofreading completes
- **Loading Indicators**: Visual feedback during background processing

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
