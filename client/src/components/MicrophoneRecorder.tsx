import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MicrophoneRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export default function MicrophoneRecorder({ onRecordingComplete }: MicrophoneRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      // Detect supported MIME type - WebM for Chrome/Firefox, MP4 for Safari
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
          mimeType = 'audio/mpeg';
        } else {
          // Use default (browser will choose)
          mimeType = '';
        }
      }
      
      // Use higher quality audio settings if available
      const options: MediaRecorderOptions = mimeType 
        ? { mimeType, audioBitsPerSecond: 128000 }
        : { audioBitsPerSecond: 128000 };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Store the actual MIME type being used for file creation
      (mediaRecorder as any)._actualMimeType = mediaRecorder.mimeType;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Get the actual MIME type used by MediaRecorder
        const actualMimeType = (mediaRecorder as any)._actualMimeType || 'audio/webm';
        
        // Determine file extension based on MIME type
        let extension = '.webm';
        if (actualMimeType.includes('mp4')) {
          extension = '.m4a';
        } else if (actualMimeType.includes('mpeg')) {
          extension = '.mp3';
        } else if (actualMimeType.includes('ogg')) {
          extension = '.ogg';
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setHasRecording(true);
        
        // Convert to File object with proper metadata and extension
        const file = new File([audioBlob], `recording-${Date.now()}${extension}`, {
          type: actualMimeType,
          lastModified: Date.now(),
        });
        
        onRecordingComplete(file);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak into your microphone",
      });
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      
      // Distinguish between permission denial and other errors
      const isDenied = error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError';
      const isNotSupported = error?.name === 'NotSupportedError';
      
      if (isDenied) {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to record audio",
          variant: "destructive",
        });
      } else if (isNotSupported) {
        toast({
          title: "Recording not supported",
          description: "Your browser doesn't support audio recording. Try using Chrome or Safari.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Recording failed",
          description: "Failed to start recording. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({
        title: "Recording stopped",
        description: "Your recording is ready",
      });
    }
  };

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setHasRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Record Voice</h3>
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <span className="font-mono text-sm" data-testid="text-recording-time">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Record your voice directly using your device's microphone
        </p>

        <div className="flex gap-3">
          {!isRecording && !hasRecording && (
            <Button
              onClick={startRecording}
              className="flex-1"
              data-testid="button-start-recording"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="flex-1"
              data-testid="button-stop-recording"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          )}

          {hasRecording && !isRecording && (
            <>
              <div className="flex-1">
                <audio 
                  controls 
                  src={audioURL || undefined} 
                  className="w-full"
                  data-testid="audio-recording-preview"
                />
              </div>
              <Button
                onClick={clearRecording}
                variant="outline"
                size="icon"
                data-testid="button-clear-recording"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {hasRecording && (
          <p className="text-xs text-muted-foreground text-center">
            Recording ready for transformation
          </p>
        )}
      </div>
    </Card>
  );
}
