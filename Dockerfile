FROM node:20-slim

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
# Note: Vite is needed at runtime due to import structure
RUN npm install

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Create directories for uploads and outputs
RUN mkdir -p uploads outputs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["npm", "start"]
