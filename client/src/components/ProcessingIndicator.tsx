import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  status?: string;
}

export default function ProcessingIndicator({ status = "Processing your audio..." }: ProcessingIndicatorProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="icon-loading" />
        <div>
          <h3 className="text-lg font-semibold mb-1">Transforming Voice</h3>
          <p className="text-sm text-muted-foreground" data-testid="text-status">
            {status}
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    </Card>
  );
}
