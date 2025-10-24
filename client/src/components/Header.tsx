import { Wand2 } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Voice Transformer</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Audio</p>
            </div>
          </div>
          <a 
            href="#how-it-works" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-help"
          >
            How it works
          </a>
        </div>
      </div>
    </header>
  );
}
