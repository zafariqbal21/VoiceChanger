import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import GenderTransformControls from "@/components/GenderTransformControls";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import ResultsSection from "@/components/ResultsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

type AppState = 'upload' | 'ready' | 'processing' | 'complete';

interface FileData {
  file: File;
  fileId: string;
}

interface TransformData {
  transformedFileId: string;
}

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [transformData, setTransformData] = useState<TransformData | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFileData({ file, fileId: data.fileId });
      setState('ready');
      
      toast({
        title: "File uploaded",
        description: "Your audio file is ready for transformation",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload audio file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearFile = () => {
    setFileData(null);
    setTransformData(null);
    setState('upload');
  };

  const handleTransform = async (transformValue: number) => {
    if (!fileData) return;

    setState('processing');

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileData.fileId,
          transformValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Transformation failed');
      }

      const data = await response.json();
      setTransformData({ transformedFileId: data.transformedFileId });
      setState('complete');
      
      toast({
        title: "Transformation complete",
        description: "Your voice has been successfully transformed!",
      });
    } catch (error) {
      console.error('Transform error:', error);
      setState('ready');
      toast({
        title: "Transformation failed",
        description: "Failed to transform audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartOver = () => {
    setFileData(null);
    setTransformData(null);
    setState('upload');
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
    if (!transformData) return;

    const link = document.createElement('a');
    link.href = `/api/download/${transformData.transformedFileId}`;
    link.download = `voice-transformed-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your transformed audio is being downloaded",
    });
  };

  const originalAudioUrl = fileData 
    ? `/api/audio/original/${fileData.fileId}`
    : undefined;
    
  const transformedAudioUrl = transformData
    ? `/api/audio/transformed/${transformData.transformedFileId}`
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
        
        <div ref={uploadSectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            {state === 'upload' && (
              <FileUpload 
                onFileSelect={handleFileSelect}
                selectedFile={fileData?.file}
                onClearFile={handleClearFile}
              />
            )}
            
            {state === 'ready' && (
              <>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  selectedFile={fileData?.file}
                  onClearFile={handleClearFile}
                />
                <GenderTransformControls onTransform={handleTransform} />
              </>
            )}
            
            {state === 'processing' && (
              <ProcessingIndicator status="Applying gender transformation..." />
            )}
            
            {state === 'complete' && (
              <ResultsSection 
                originalAudioUrl={originalAudioUrl}
                transformedAudioUrl={transformedAudioUrl}
                onDownload={handleDownload}
                onStartOver={handleStartOver}
              />
            )}
          </div>
        </div>
        
        <HowItWorks />
      </main>
      
      <Footer />
    </div>
  );
}
