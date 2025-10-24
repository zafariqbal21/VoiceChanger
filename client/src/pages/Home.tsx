import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import GenderTransformControls from "@/components/GenderTransformControls";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import ResultsSection from "@/components/ResultsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

type AppState = 'upload' | 'ready' | 'processing' | 'complete';

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setState('ready');
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setState('upload');
  };

  const handleTransform = () => {
    setState('processing');
    // Simulate processing
    setTimeout(() => {
      setState('complete');
    }, 3000);
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setState('upload');
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
    console.log('Download initiated');
    // In real app, this would trigger file download
  };

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
                selectedFile={selectedFile}
                onClearFile={handleClearFile}
              />
            )}
            
            {state === 'ready' && (
              <>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
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
