import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";

const uploadsDir = path.join(process.cwd(), "uploads");
const outputDir = path.join(process.cwd(), "outputs");

async function ensureDirectories() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureDirectories();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Get extension from original filename, or use a default based on MIME type
    let extension = path.extname(file.originalname);
    if (!extension && file.mimetype) {
      // Map MIME types to extensions for browser recordings
      const mimeToExt: Record<string, string> = {
        'audio/webm': '.webm',
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/mp4': '.m4a',
        'audio/m4a': '.m4a',
      };
      extension = mimeToExt[file.mimetype] || '.webm';
    }
    const uniqueName = `${randomUUID()}${extension}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg', 
      'audio/wav', 
      'audio/mp3', 
      'audio/x-m4a', 
      'audio/m4a',
      'audio/ogg', 
      'audio/webm', // Support for browser microphone recordings
      'audio/mp4'
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

function transformAudio(
  inputPath: string,
  outputPath: string,
  transformValue: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Transform value is 0-100
    // 0 = very masculine (pitch down)
    // 50 = neutral (no change)
    // 100 = very feminine (pitch up)
    
    // If neutral (50), just copy the file without transformation
    if (transformValue === 50) {
      try {
        await fs.copyFile(inputPath, outputPath);
        resolve();
      } catch (err) {
        reject(err);
      }
      return;
    }
    
    // Map 0-100 to semitone shift: -4 to +4
    const semitoneShift = ((transformValue - 50) / 50) * 4;
    
    // Pitch shift using asetrate and atempo
    // This maintains audio quality while changing pitch
    const pitchRatio = Math.pow(2, semitoneShift / 12);
    
    ffmpeg(inputPath)
      .audioFilters([
        // Adjust sample rate to change pitch
        `asetrate=44100*${pitchRatio}`,
        // Restore tempo to original speed
        'aresample=44100'
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureDirectories();

  // Upload endpoint
  app.post("/api/upload", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      res.json({
        success: true,
        fileId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Transform endpoint
  app.post("/api/transform", async (req, res) => {
    try {
      const { fileId, transformValue } = req.body;

      if (!fileId || typeof transformValue !== 'number') {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const inputPath = path.join(uploadsDir, fileId);
      const outputFilename = `transformed-${randomUUID()}.mp3`;
      const outputPath = path.join(outputDir, outputFilename);

      // Check if input file exists
      try {
        await fs.access(inputPath);
      } catch {
        return res.status(404).json({ error: "Original file not found" });
      }

      // Transform the audio
      await transformAudio(inputPath, outputPath, transformValue);

      res.json({
        success: true,
        transformedFileId: outputFilename,
      });
    } catch (error) {
      console.error("Transform error:", error);
      res.status(500).json({ error: "Failed to transform audio" });
    }
  });

  // Download endpoint
  app.get("/api/download/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const filePath = path.join(outputDir, fileId);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: "File not found" });
      }

      res.download(filePath, `voice-transformed-${Date.now()}.mp3`, (err) => {
        if (err) {
          console.error("Download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to download file" });
          }
        }
      });
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Stream audio for playback
  app.get("/api/audio/:type/:fileId", async (req, res) => {
    try {
      const { type, fileId } = req.params;
      const filePath = type === 'original' 
        ? path.join(uploadsDir, fileId)
        : path.join(outputDir, fileId);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: "File not found" });
      }

      const stat = await fs.stat(filePath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });

      const readStream = (await import('fs')).createReadStream(filePath);
      readStream.pipe(res);
    } catch (error) {
      console.error("Audio stream error:", error);
      res.status(500).json({ error: "Failed to stream audio" });
    }
  });

  // Cleanup old files periodically (optional)
  setInterval(async () => {
    try {
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour

      for (const dir of [uploadsDir, outputDir]) {
        const files = await fs.readdir(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (now - stats.mtimeMs > maxAge) {
            await fs.unlink(filePath);
          }
        }
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, 30 * 60 * 1000); // Run every 30 minutes

  const httpServer = createServer(app);
  return httpServer;
}
