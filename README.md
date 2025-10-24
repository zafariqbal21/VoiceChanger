# Voice Transformer - AI-Powered Gender Voice Transformation

A web-based audio processing application that enables users to transform audio files with AI-powered gender voice transformation. Upload audio files (MP3, WAV, M4A, OGG), adjust transformation parameters using an intuitive slider interface, and download professionally processed results.

## Features

- **Audio File Upload**: Drag-and-drop or browse to upload audio files
- **Gender Transformation**: Slider control with pitch shifting (-4 to +4 semitones)
  - Masculine (0-49): Lower pitch
  - Neutral (50): No change
  - Feminine (51-100): Higher pitch
- **Quick Presets**: One-click buttons for common transformations
- **Audio Playback**: Compare original vs transformed audio side-by-side
- **Download**: Get your transformed audio as MP3
- **Privacy-First**: Files automatically cleaned up after 1 hour

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + Shadcn UI components
- React Query for state management
- Wouter for routing

**Backend:**
- Express.js with TypeScript
- FFmpeg for audio processing
- Multer for file uploads
- Node.js 20+

## Prerequisites

Before running this application, ensure you have:

- **Node.js** 20 or higher
- **FFmpeg** installed on your system
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt-get install ffmpeg`
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd voice-transformer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify FFmpeg installation**
   ```bash
   ffmpeg -version
   ```

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Deployment

### Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. **Prepare your server**
   ```bash
   # Install Node.js 20+
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install FFmpeg
   sudo apt-get install -y ffmpeg
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy your code**
   ```bash
   # Clone your repository
   git clone <your-repo-url>
   cd voice-transformer
   
   # Install dependencies
   npm install
   
   # Build the application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "voice-transformer" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add FFmpeg buildpack** (in Railway dashboard)
   - Go to your project settings
   - Add custom build command: Install FFmpeg via apt
   - Or use a Docker deployment with FFmpeg included

### Deploy to Render

1. **Create a new Web Service** in Render dashboard
2. **Configure build settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Add FFmpeg:** Use a custom Dockerfile or specify in render.yaml

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t voice-transformer .
docker run -p 5000:5000 voice-transformer
```

## Project Structure

```
voice-transformer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and helpers
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts          # API endpoints
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite integration
├── shared/                # Shared TypeScript types
├── uploads/               # Temporary upload directory
├── outputs/               # Temporary output directory
└── dist/                  # Production build output
```

## API Documentation

### POST `/api/upload`
Upload an audio file

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `audio` field with file

**Response:**
```json
{
  "success": true,
  "fileId": "uuid-filename.mp3",
  "originalName": "original.mp3",
  "size": 1234567
}
```

### POST `/api/transform`
Transform uploaded audio

**Request:**
```json
{
  "fileId": "uuid-filename.mp3",
  "transformValue": 75
}
```

**Response:**
```json
{
  "success": true,
  "transformedFileId": "transformed-uuid.mp3"
}
```

### GET `/api/download/:fileId`
Download transformed audio file

### GET `/api/audio/:type/:fileId`
Stream audio for playback
- `type`: `original` or `transformed`

## Configuration

The application uses sensible defaults and doesn't require environment variables for basic operation. Optional configurations:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

## File Storage

- Uploaded files are stored in `uploads/` directory
- Transformed files are stored in `outputs/` directory
- Files are automatically cleaned up after 1 hour
- Maximum file size: 50MB

## Security Considerations

- File uploads are validated by MIME type
- File size is limited to 50MB
- Automatic file cleanup prevents disk space issues
- Files are stored with UUID-based filenames

## Troubleshooting

**FFmpeg not found:**
- Ensure FFmpeg is installed and in your system PATH
- Test with: `ffmpeg -version`

**Port already in use:**
- Change the port in `server/index.ts` or set `PORT` environment variable

**Upload fails:**
- Check file size (max 50MB)
- Ensure file is a valid audio format
- Check server logs for detailed error messages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
