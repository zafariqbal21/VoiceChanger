import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AudioPlayer from "./AudioPlayer";

interface ResultsSectionProps {
  originalAudioUrl?: string;
  transformedAudioUrl?: string;
  onDownload?: () => void;
  onStartOver?: () => void;
}

export default function ResultsSection({ 
  originalAudioUrl, 
  transformedAudioUrl,
  onDownload,
  onStartOver 
}: ResultsSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Results</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-medium mb-2">Original</p>
          <AudioPlayer audioUrl={originalAudioUrl} label="Original Voice" />
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Transformed</p>
          <AudioPlayer audioUrl={transformedAudioUrl} label="Transformed Voice" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          className="flex-1"
          onClick={onDownload}
          data-testid="button-download"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          variant="outline"
          onClick={onStartOver}
          data-testid="button-start-over"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
      </div>
    </Card>
  );
}
