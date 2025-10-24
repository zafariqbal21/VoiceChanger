import { Upload, Settings, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Audio",
      description: "Choose your audio file in MP3, WAV, M4A, or OGG format"
    },
    {
      icon: Settings,
      title: "Adjust Settings",
      description: "Select gender transformation level with our easy-to-use controls"
    },
    {
      icon: Download,
      title: "Download Result",
      description: "Get your professionally transformed audio in seconds"
    }
  ];

  return (
    <section id="how-it-works" className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your voice in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 text-center" data-testid={`card-step-${index}`}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
