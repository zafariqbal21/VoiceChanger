# Voice Transformer - AI-Powered Gender Voice Transformation

## Overview

Voice Transformer is a web-based audio processing application that enables users to transform audio files with AI-powered gender voice transformation. Users can **record their voice directly in the browser** or upload audio files (MP3, WAV, M4A, OGG, WebM), adjust transformation parameters using an intuitive slider interface, and download professionally processed results. The application is a **Progressive Web App (PWA)** that can be installed on mobile devices and works seamlessly across all platforms. The app prioritizes clarity, immediate feedback, and privacy-first processing where audio is never permanently stored.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing

**UI Component System**: Shadcn UI (New York style) with Radix UI primitives
- Material Design principles emphasizing functionality over decoration
- Tailwind CSS for styling with custom design tokens
- Inter font family for typography
- Responsive design with mobile-first approach

**State Management**:
- React Query (@tanstack/react-query) for server state management
- Local component state using React hooks
- Custom hooks for reusable logic (e.g., `useToast`, `useIsMobile`)

**Key UI Components**:
- AudioInputSelector: Tab interface to switch between file upload and microphone recording
- MicrophoneRecorder: Browser-based audio recording with cross-browser support
- FileUpload: Drag-and-drop zone with file validation
- AudioPlayer: Waveform display with playback controls
- GenderTransformControls: Slider-based transformation interface with presets
- ProcessingIndicator: Loading states during audio transformation
- ResultsSection: Side-by-side comparison with download functionality
- InstallPrompt: PWA installation prompt for mobile devices

**Design System**:
- Spacing units: Consistent Tailwind spacing (3, 4, 6, 8, 12)
- Container strategy: max-w-4xl for main content, max-w-2xl for controls
- Color system: HSL-based with CSS variables for theme support
- Progressive disclosure: Advanced controls shown only when needed

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Server Setup**:
- ESM modules throughout
- Hot module replacement via Vite in development
- Custom request/response logging middleware
- Built with esbuild for production

**API Structure**:
- RESTful endpoints under `/api` prefix
- File upload endpoint: `POST /api/upload`
- Transform endpoint: `POST /api/transform`
- Static file serving for processed audio

**Audio Processing**:
- FFmpeg (fluent-ffmpeg) for audio manipulation
- Pitch shifting based on transformation value (0-100 scale)
- File storage in temporary directories (`uploads/` and `outputs/`)
- Automatic cleanup strategy (files not permanently stored)

**File Handling**:
- Multer for multipart/form-data uploads
- 50MB file size limit
- MIME type validation for audio files
- UUID-based unique file naming

**Session Management**:
- In-memory storage implementation (MemStorage)
- Prepared for database integration via IStorage interface
- User schema defined with Drizzle ORM

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL
- Schema defined in `shared/schema.ts`
- Migration support via drizzle-kit
- Neon Database serverless driver (@neondatabase/serverless)

**Current Schema**:
- Users table with username/password authentication structure
- UUID primary keys with PostgreSQL's gen_random_uuid()

**File Storage**:
- Temporary local filesystem storage for audio files
- Separate directories for uploads and processed outputs
- No persistent storage of user audio (privacy-focused design)

**Session Store**:
- In-memory implementation for development
- Interface-based design allows easy swap to PostgreSQL sessions (connect-pg-simple available)

### Authentication and Authorization

**Current Implementation**:
- User schema prepared with username/password fields
- Storage interface defines user CRUD operations
- No active authentication flow implemented yet

**Prepared Infrastructure**:
- Drizzle Zod schemas for validation (insertUserSchema)
- TypeScript types for User and InsertUser
- Storage abstraction allows multiple backend implementations

### External Dependencies

**Audio Processing**:
- FFmpeg: Core audio transformation engine
- fluent-ffmpeg: Node.js wrapper for FFmpeg operations

**Database**:
- PostgreSQL: Primary database (via DATABASE_URL environment variable)
- Neon Database: Serverless PostgreSQL provider
- Drizzle ORM: Type-safe database queries and migrations

**UI Libraries**:
- Radix UI: Headless component primitives for accessibility
- Tailwind CSS: Utility-first styling framework
- Lucide React: Icon library
- Google Fonts: Inter font family

**Development Tools**:
- Vite: Fast build tool and development server
- TypeScript: Type safety across frontend and backend
- ESBuild: Production bundling for server code
- Replit plugins: Cartographer, dev banner, runtime error overlay

**Third-party Services**:
- None currently integrated (prepared for future AI service integration)
- All audio processing happens server-side using FFmpeg

**Build & Deployment**:
- Production build: Vite for client, esbuild for server
- Server runs on configurable port (defaults to 5000)
- Static assets served from `dist/public`
- Fully portable - can be deployed to any Node.js hosting platform
- Docker support included with Dockerfile
- Comprehensive deployment guides for Railway, Render, AWS, DigitalOcean, Heroku, etc.
- No environment variables required for basic operation
- Optional: DATABASE_URL (for future database features)

### Recent Changes (October 24, 2025)

**Microphone Recording Feature**:
- Added browser-based voice recording with Web Audio API
- Cross-browser support: WebM (Chrome/Firefox), MP4 (Safari/iOS)
- Feature detection with automatic fallback to supported formats
- Recording timer with visual feedback
- High-quality audio settings (echo cancellation, noise suppression, 128kbps)
- Seamless integration with existing upload/transform pipeline

**Progressive Web App (PWA) Enhancements**:
- Service worker for offline support and faster loading
- Web app manifest for home screen installation
- Custom app icons (192px and 512px)
- Install prompt for mobile users
- Mobile-optimized meta tags and theme colors
- Works on iPhone, iPad, Android phones and tablets

### Deployment Information

**Deployment-Ready**:
The application is fully portable and can be deployed outside of Replit to any platform that supports Node.js 20+ and FFmpeg. See `README.md`, `DEPLOYMENT.md`, and `MOBILE.md` for comprehensive deployment guides.

**Requirements**:
- Node.js 20 or higher
- FFmpeg installed on the server
- At least 512MB RAM (1GB recommended)

**Supported Platforms**:
- Railway (recommended - auto-detects FFmpeg)
- Render (with Dockerfile)
- DigitalOcean App Platform
- AWS EC2/Elastic Beanstalk
- Google Cloud Run
- Heroku (with FFmpeg buildpack)
- Fly.io
- Any VPS with Node.js + FFmpeg

**Quick Deploy**:
```bash
npm install
npm run build
npm start
```

The app includes Docker support for containerized deployment on any platform.