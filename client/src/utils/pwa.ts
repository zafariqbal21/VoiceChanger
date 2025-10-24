// Register service worker for PWA functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
}

// Check if app is installed (PWA)
export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}

// Prompt user to install PWA
export function canInstallPWA(): boolean {
  return 'BeforeInstallPromptEvent' in window;
}
