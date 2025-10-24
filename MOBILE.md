# Mobile & PWA Guide

Your Voice Transformer app is now fully mobile-friendly and can be installed as a Progressive Web App (PWA) on phones and tablets!

## What's Mobile-Optimized

✅ **Responsive Design** - Works perfectly on all screen sizes
✅ **Touch-Friendly** - All buttons and controls optimized for touch
✅ **PWA Support** - Install on home screen like a native app
✅ **Offline Ready** - Service worker for faster loading
✅ **Mobile Gestures** - Drag-and-drop file upload works on mobile
✅ **Audio Controls** - Native mobile audio playback support

## Installing on Mobile Devices

### iPhone/iPad (iOS)

1. **Open Safari** (must use Safari, not Chrome)
2. Navigate to your app URL
3. Tap the **Share button** (box with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**
6. The app icon will appear on your home screen

### Android

1. **Open Chrome** (recommended)
2. Navigate to your app URL
3. You'll see an **"Install"** prompt at the bottom
   - Tap **"Install"** when prompted
4. **Alternative method:**
   - Tap the **menu** (three dots)
   - Select **"Add to Home Screen"** or **"Install app"**
5. The app will appear in your app drawer and home screen

## Testing Mobile Locally

### Using ngrok (Quick & Easy)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your app:**
   ```bash
   npm run dev
   ```

3. **Expose to internet:**
   ```bash
   ngrok http 5000
   ```

4. **Access on phone:**
   - Copy the `https://` URL from ngrok
   - Open on your phone's browser
   - Install as PWA!

### Using Your Local Network

1. **Find your computer's IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Start app on all interfaces:**
   Edit `server/index.ts` to use `0.0.0.0`:
   ```typescript
   app.listen(port, '0.0.0.0', () => {
     console.log(`Server running on port ${port}`);
   });
   ```

3. **Access on phone:**
   - Connect phone to same WiFi
   - Open browser to `http://YOUR-IP:5000`
   - Note: PWA requires HTTPS, so use ngrok for full testing

## Mobile Features

### Audio Upload on Mobile

- **Take a photo** - Won't work (audio only)
- **Voice Recording** - Use your phone's voice recorder app
- **Cloud Storage** - Upload from Google Drive, Dropbox, etc.
- **Files App** - Select from your device storage

### Mobile Audio Playback

- Uses native mobile audio controls
- Works in background on iOS
- Supports headphones and Bluetooth speakers
- Volume controls integrated with phone volume

### Mobile File Download

- **iOS**: Files download to Files app
- **Android**: Files download to Downloads folder
- Tap the downloaded file to play in music player

## PWA Features

When installed as PWA, users get:

- **App Icon** - Appears on home screen with custom icon
- **Splash Screen** - Professional loading screen
- **Standalone Mode** - Runs without browser UI
- **Fast Loading** - Service worker caches assets
- **Native Feel** - Looks and feels like a native app

## Mobile Best Practices

### File Size Considerations

Mobile users often have limited data:
- 50MB max file size (configurable)
- Compressed audio recommended
- Processing happens on server (no mobile battery drain)

### Offline Capability

The PWA service worker caches:
- App shell and UI
- Static assets
- Does NOT cache audio files (too large)

### Battery & Performance

- Audio processing on server = saves mobile battery
- Files auto-delete after 1 hour = saves storage
- Optimized React rendering for smooth mobile UI

## Customization

### Change App Icon

Replace `client/public/icon-192.png` and `client/public/icon-512.png` with your own icons.

### Change Theme Color

Edit `client/public/manifest.json`:
```json
{
  "theme_color": "#7c3aed",  // Change this
  "background_color": "#ffffff"
}
```

And in `client/index.html`:
```html
<meta name="theme-color" content="#7c3aed">
```

### Change App Name

Edit `client/public/manifest.json`:
```json
{
  "name": "Voice Transformer",
  "short_name": "VoiceTransform"
}
```

## Testing Checklist

Before deploying, test on mobile:

- [ ] Upload file via mobile file picker
- [ ] Play original audio
- [ ] Adjust transformation slider
- [ ] Click preset buttons
- [ ] Transform audio
- [ ] Play transformed audio
- [ ] Download transformed file
- [ ] Install as PWA
- [ ] Use installed PWA app
- [ ] Test in portrait and landscape
- [ ] Test on small screen (phone) and tablet

## Deployment Considerations

### HTTPS Required

PWA features require HTTPS:
- Use Railway, Render, or any platform with auto-HTTPS
- Or setup Let's Encrypt on your VPS
- Local testing: use ngrok

### File Upload Limits

Mobile carriers may limit:
- Check your hosting platform's upload limits
- Nginx: `client_max_body_size 50M;`
- Express: Already configured to 50MB

### Mobile Browser Support

Tested and working on:
- ✅ iOS Safari 14+
- ✅ Chrome Android 80+
- ✅ Samsung Internet 12+
- ✅ Firefox Android 90+

## Troubleshooting

**PWA won't install:**
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify icons exist and are correct size

**Audio won't play:**
- Check file format (MP3 works everywhere)
- Ensure proper MIME types
- Test with different audio files

**Upload fails on mobile:**
- Check file size (max 50MB)
- Verify internet connection
- Try smaller files first

**Service worker issues:**
- Clear browser cache
- Check browser console for errors
- Verify `sw.js` is accessible

## Mobile Analytics (Optional)

Track mobile usage by adding to your app:

```typescript
// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Detect PWA install
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

console.log('Mobile:', isMobile, 'PWA:', isPWA);
```

## Next Steps

1. Deploy your app with HTTPS
2. Test on your phone
3. Share the link with others
4. Monitor usage and feedback
5. Optimize based on mobile user behavior

Your app is now ready to be used on any mobile device! 📱
