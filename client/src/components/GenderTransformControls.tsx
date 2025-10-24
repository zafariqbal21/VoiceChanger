import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface GenderTransformControlsProps {
  onTransform?: (value: number) => void;
}

export default function GenderTransformControls({ onTransform }: GenderTransformControlsProps) {
  const [transformValue, setTransformValue] = useState([50]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = [
    { id: 'masculine', label: 'Masculine', value: 25 },
    { id: 'neutral', label: 'Neutral', value: 50 },
    { id: 'feminine', label: 'Feminine', value: 75 },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setTransformValue([preset.value]);
    setSelectedPreset(preset.id);
    console.log(`Preset ${preset.label} selected: ${preset.value}`);
  };

  const handleSliderChange = (value: number[]) => {
    setTransformValue(value);
    setSelectedPreset(null);
  };

  const handleTransform = () => {
    onTransform?.(transformValue[0]);
    console.log('Transform triggered with value:', transformValue[0]);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Gender Transformation</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Masculine</span>
            <span className="text-sm text-muted-foreground">Feminine</span>
          </div>
          <Slider
            value={transformValue}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            data-testid="slider-transform"
          />
          <div className="text-center mt-2">
            <span className="text-sm font-medium" data-testid="text-transform-value">
              {transformValue[0]}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-3">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Badge
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "secondary"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => handlePresetClick(preset)}
                data-testid={`badge-preset-${preset.id}`}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          className="w-full"
          size="lg"
          onClick={handleTransform}
          data-testid="button-transform"
        >
          Transform Voice
        </Button>
      </div>
    </Card>
  );
}
