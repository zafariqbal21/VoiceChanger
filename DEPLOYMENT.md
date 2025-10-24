# Deployment Guide

This guide covers deploying the Voice Transformer app to various platforms.

## Quick Start

For any deployment platform, ensure:
1. ✅ Node.js 20+ is available
2. ✅ FFmpeg is installed
3. ✅ Build and start scripts work locally

Test locally first:
```bash
npm install
npm run build
npm start
```

## Platform-Specific Guides

### 1. Railway.app (Recommended)

Railway provides easy deployment with automatic FFmpeg support.

**Steps:**
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects the build configuration
5. Add FFmpeg via Nixpacks (Railway handles this automatically)

**Custom Configuration (railway.json):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Render.com

Render requires a custom build to include FFmpeg.

**Option A: Using render.yaml**

Create `render.yaml`:
```yaml
services:
  - type: web
    name: voice-transformer
    env: node
    buildCommand: |
      apt-get update && apt-get install -y ffmpeg
      npm install
      npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
```

**Option B: Using Dockerfile**

Create `Dockerfile`:
```dockerfile
FROM node:20

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Then in Render dashboard:
- New → Web Service → Deploy an existing Docker image
- Connect your repository
- Render will auto-detect the Dockerfile

### 3. DigitalOcean App Platform

**Using Dockerfile (Recommended):**
1. Add the Dockerfile from Render guide above
2. Create new App in DigitalOcean
3. Connect GitHub repository
4. App Platform auto-detects Dockerfile
5. Deploy

**Using Buildpack:**
1. Create `.do/app.yaml`:
```yaml
name: voice-transformer
services:
- name: web
  github:
    repo: your-username/voice-transformer
    branch: main
    deploy_on_push: true
  build_command: npm install && npm run build
  run_command: npm start
  envs:
  - key: NODE_ENV
    value: production
  http_port: 5000
```

### 4. AWS (EC2 or Elastic Beanstalk)

**EC2 Deployment:**

1. **Launch Ubuntu 22.04 EC2 instance**

2. **SSH into instance and setup:**
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
sudo apt-get install -y ffmpeg

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd voice-transformer

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "voice-transformer" -- start
pm2 save
pm2 startup
```

3. **Configure security group:**
   - Add inbound rule for port 5000 (or 80 if using Nginx)

4. **Setup Nginx (optional):**
```bash
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/voice-transformer
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/voice-transformer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Heroku

Heroku requires FFmpeg buildpack.

1. **Create Heroku app:**
```bash
heroku create your-app-name
```

2. **Add FFmpeg buildpack:**
```bash
heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
heroku buildpacks:add --index 2 heroku/nodejs
```

3. **Deploy:**
```bash
git push heroku main
```

### 6. Google Cloud Run

Requires Docker.

1. **Create Dockerfile** (use Render example above)

2. **Build and deploy:**
```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT-ID/voice-transformer

# Deploy to Cloud Run
gcloud run deploy voice-transformer \
  --image gcr.io/PROJECT-ID/voice-transformer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi
```

### 7. Fly.io

1. **Install flyctl:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Initialize and deploy:**
```bash
fly launch
# Follow prompts
```

3. **Create fly.toml:**
```toml
app = "voice-transformer"

[build]
  builder = "heroku/buildpacks:20"
  buildpacks = [
    "https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest",
    "heroku/nodejs"
  ]

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### 8. Self-Hosted (VPS)

For VPS providers like Linode, Vultr, Hetzner:

**Quick Setup Script:**
```bash
#!/bin/bash

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
sudo apt-get install -y ffmpeg

# Install PM2 globally
sudo npm install -g pm2

# Clone repository
cd /var/www
sudo git clone <your-repo-url> voice-transformer
cd voice-transformer

# Install dependencies
sudo npm install

# Build
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "voice-transformer" -- start
sudo pm2 save
sudo pm2 startup
```

## Post-Deployment Checklist

After deploying to any platform:

- [ ] Test file upload functionality
- [ ] Test audio transformation (try all slider values)
- [ ] Test audio playback (both original and transformed)
- [ ] Test file download
- [ ] Verify FFmpeg is working: check logs for transformation success
- [ ] Monitor disk space (files auto-cleanup after 1 hour)
- [ ] Set up monitoring/alerts
- [ ] Configure custom domain (if needed)
- [ ] Enable HTTPS/SSL certificate

## Environment Variables

Most platforms don't require environment variables, but you can optionally set:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to "production"

## Monitoring & Logs

Check application logs for debugging:

**Railway:** Built-in log viewer in dashboard
**Render:** Logs tab in service dashboard
**Heroku:** `heroku logs --tail`
**PM2 (VPS):** `pm2 logs voice-transformer`
**Docker:** `docker logs <container-id>`

## Common Issues

**FFmpeg not found:**
- Ensure FFmpeg buildpack/installation is included
- Check logs: `ffmpeg -version` should work

**File upload fails:**
- Increase max body size in reverse proxy (Nginx: `client_max_body_size`)
- Check platform file size limits

**Memory issues:**
- Audio processing requires adequate memory
- Recommended: At least 512MB RAM, 1GB preferred

**Disk space:**
- Auto-cleanup runs every 30 minutes
- Monitor disk usage on long-running instances

## Performance Tips

1. **Use a CDN** for static assets (if needed)
2. **Enable gzip compression** in Nginx/reverse proxy
3. **Scale horizontally** for high traffic (add replicas)
4. **Monitor memory** usage during peak times
5. **Set up health checks** for automatic restarts

## Support

If you encounter deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify FFmpeg installation
4. Test build locally first
