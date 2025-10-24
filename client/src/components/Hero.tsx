import heroImage from "@assets/generated_images/Audio_waveform_transformation_visualization_99fa180a.png";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface HeroProps {
  onGetStarted?: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Audio waveform transformation" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Transform Your Voice with AI
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Professional gender voice transformation in seconds. Upload your audio, 
            adjust the settings, and download high-quality results instantly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm">Fast Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm">High Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm">Privacy First</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            onClick={onGetStarted}
            data-testid="button-get-started"
            className="text-base px-8"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
