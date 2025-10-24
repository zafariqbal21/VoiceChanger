import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "./FileUpload";
import MicrophoneRecorder from "./MicrophoneRecorder";

interface AudioInputSelectorProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onClearFile?: () => void;
}

export default function AudioInputSelector({ 
  onFileSelect, 
  selectedFile, 
  onClearFile 
}: AudioInputSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleRecordingComplete = (file: File) => {
    onFileSelect(file);
    setActiveTab("upload"); // Switch to upload tab to show the file
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload" data-testid="tab-upload">
          Upload File
        </TabsTrigger>
        <TabsTrigger value="record" data-testid="tab-record">
          Record Voice
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="mt-4">
        <FileUpload
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          onClearFile={onClearFile}
        />
      </TabsContent>
      
      <TabsContent value="record" className="mt-4">
        <MicrophoneRecorder onRecordingComplete={handleRecordingComplete} />
      </TabsContent>
    </Tabs>
  );
}
