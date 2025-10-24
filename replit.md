# Voice Transformer - AI-Powered Gender Voice Transformation

## Overview

Voice Transformer is a web-based audio processing application that enables users to transform audio files with AI-powered gender voice transformation. Users can upload audio files (MP3, WAV, M4A, OGG), adjust transformation parameters using an intuitive slider interface, and download professionally processed results. The application prioritizes clarity, immediate feedback, and privacy-first processing where uploaded audio is never permanently stored.

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
- FileUpload: Drag-and-drop zone with file validation
- AudioPlayer: Waveform display with playback controls
- GenderTransformControls: Slider-based transformation interface with presets
- ProcessingIndicator: Loading states during audio transformation
- ResultsSection: Side-by-side comparison with download functionality

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
- Environment variables required: DATABASE_URL