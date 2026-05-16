# MOBILE FIXES - IMPLEMENTATION GUIDE

This document provides exact code changes needed to pass mobile audit.

---

## FIX 1: Add Video Fallback & Error Handling
**File**: `components/InteractiveHero.js`
**Why**: Blank hero on video load failure

### Current Code (lines 57-60):
```jsx
<div className="hero-container">
  <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
    <source src={videoUrl} type="video/mp4" />
  </video>
  <div className="hero-overlay" />
```

### Fixed Code:
```jsx
<div className="hero-container">
  <video 
    className="hero-video" 
    autoPlay 
    muted 
    loop 
    playsInline 
    preload="metadata"
    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%231a1a2e' width='1920' height='1080'/%3E%3C/svg%3E"
  >
    <source src={videoUrl} type="video/mp4" />
    <p style={{ position: 'absolute', color: 'white', textAlign: 'center', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      Video unavailable - please try refreshing the page
    </p>
  </video>
  <div className="hero-overlay" />
```

### Alternative: Add onError handler
Add this inside component:
```jsx
const [videoError, setVideoError] = useState(false);

// In JSX:
<video 
  className="hero-video" 
  autoPlay 
  muted 
  loop 
  playsInline 
  preload="metadata"
  onError={() => setVideoError(true)}
  style={{ background: videoError ? '#1a1a2e' : 'transparent' }}
>
```

---

## FIX 2: Add 480px Mobile Breakpoint
**File**: `styles/Home.module.css`
**Why**: Form modal, typography, and layout not optimized for phones under 480px

### Add this block at the end of the file (before final comment):

```css
/* Mobile phones (480px and below) */
@media (max-width: 480px) {
  /* Typography */
  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .heroText h2 {
    font-size: 1.5rem;
  }

  .fleetHeader h2 {
    font-size: 2rem;
  }

  /* Modal Form - CRITICAL */
  .modalContent {
    padding: 30px 20px;
    max-width: 95vw;
    margin: 0 auto;
    border-radius: 12px;
  }

  .modalContent h3 {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  .modalContent p {
    font-size: 0.95rem;
  }

  /* Form inputs - iOS zoom prevention */
  .form input,
  .form textarea {
    font-size: 16px; /* Must be 16px to prevent iOS zoom */
    padding: 12px 14px;
  }

  .form {
    gap: 14px;
  }

  /* Submit buttons */
  .submitBtn {
    padding: 12px 16px;
    font-size: 1rem;
  }

  .whatsappBtn {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  /* Close button - touch target */
  .closeBtn {
    width: 44px;
    height: 44px;
    font-size: 1.5rem;
    top: 16px;
    right: 16px;
  }

  /* Hero section */
  .hero {
    padding: 50px 20px;
    margin: 30px 20px;
    border-radius: 16px;
  }

  .heroText p {
    font-size: 1rem;
  }

  /* Fleet section */
  .fleet {
    padding: 40px 20px;
  }

  .fleetHeader {
    margin-bottom: 40px;
  }

  .pricingHighlight {
    margin-top: 15px;
    font-size: 1.2rem;
  }

  .carsGrid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .carCard {
    border-radius: 12px;
  }

  .carImage {
    height: 240px;
  }

  .carContent {
    padding: 24px;
  }

  .carIndex {
    font-size: 2.5rem;
    top: 10px;
    right: 15px;
  }

  .carName {
    font-size: 1.4rem;
  }

  .carDescription {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .specs {
    margin-bottom: 20px;
    padding-bottom: 20px;
  }

  .specRow {
    padding: 10px 0;
    font-size: 0.9rem;
  }

  .features {
    gap: 8px;
  }

  .feature {
    font-size: 0.85rem;
    padding: 6px 10px;
  }

  .inquireBtn {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  /* Benefits section */
  .benefitsGrid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .benefitCard {
    padding: 24px 16px;
  }

  .benefitIcon {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .benefitHeadline {
    font-size: 1.2rem;
  }

  .benefitDescription {
    font-size: 0.95rem;
  }

  /* CTA section */
  .cta {
    padding: 40px 20px;
  }

  .cta h2 {
    font-size: 1.8rem;
  }

  .cta p {
    font-size: 0.95rem;
  }

  .ctaButtons {
    flex-direction: column;
    gap: 12px;
  }

  .ctaButton,
  .ctaButtonSecondary {
    padding: 14px 20px;
    font-size: 0.95rem;
    width: 100%;
  }

  /* Language switcher */
  .sideLangSwitcher {
    position: fixed;
    right: 10px;
    top: auto;
    bottom: 20px;
    transform: none;
    flex-direction: row;
    gap: 8px;
    padding: 8px 6px;
    border-radius: 8px;
  }

  .sideLangBtn {
    padding: 8px 12px;
    font-size: 0.85rem;
    min-width: auto;
  }

  /* Language modal */
  .langModalPopup {
    padding: 40px 24px;
    max-width: 90vw;
  }

  .langModalPopup h2 {
    font-size: 1.6rem;
  }

  .langModalBtn {
    padding: 12px 30px;
    font-size: 0.95rem;
    min-width: 120px;
  }

  /* Footer */
  .footer {
    padding: 40px 20px;
  }

  .footer p {
    font-size: 0.95rem;
  }

  /* Header */
  .header {
    padding: 40px 20px;
  }

  /* Error/Success messages */
  .errorAlert,
  .successMessage {
    font-size: 0.95rem;
    padding: 12px 14px;
  }

  .errorText {
    font-size: 0.85rem;
  }

  .charCounter {
    font-size: 0.85rem;
  }
}

/* Extra small phones (below 375px) */
@media (max-width: 375px) {
  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .sideLangSwitcher {
    right: 8px;
    bottom: 15px;
  }

  .hero {
    padding: 40px 15px;
    margin: 25px 15px;
  }

  .cta {
    padding: 30px 15px;
  }

  .cta h2 {
    font-size: 1.5rem;
  }
}
```

---

## FIX 3: Upload Video File
**File**: `public/videos/hero-north-cyprus-ai.mp4`

### Option A: Self-hosted video (current code path)
1. Create directory: `public/videos/`
2. Add video file: `hero-north-cyprus-ai.mp4`
3. Size recommendations:
   - Desktop: 1920x1080, 5-10MB, 8-15 seconds
   - Mobile: Compress to 1280x720, 2-4MB

### Option B: Use Vercel Blob (recommended for production)
1. Deploy to Vercel
2. Upload video via Vercel Blob Storage
3. Get URL: `https://blob.vercel-storage.com/xxxxx.mp4`
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_BLOB_VIDEO_URL=https://blob.vercel-storage.com/xxxxx.mp4
   ```

### Video Compression Example (ffmpeg):
```bash
# For mobile (360p, 2MB)
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -c:a aac -b:a 96k output-mobile.mp4

# For desktop (1080p, 5MB)
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 -c:a aac -b:a 128k output-desktop.mp4
```

---

## FIX 4: Optional - Add Image Fallback
**File**: `components/InteractiveHero.js`

Add fallback image generation or import:

```jsx
// Option 1: SVG placeholder
const heroPoster = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Crect fill=%22%231a1a2e%22 width=%221920%22 height=%221080%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2248%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EVideo Loading...%3C/text%3E%3C/svg%3E';

// Option 2: Import real image
import heroPosterImage from '../public/images/hero-poster.jpg';
const heroPoster = heroPosterImage;

// Use in video element:
<video poster={heroPoster} ... >
```

---

## TESTING VERIFICATION

After applying fixes, test:

### Desktop (1920x1080)
```
curl -I http://localhost:3000/
# Check: 200 OK
# Check video loads in DevTools
```

### iPhone 12 Pro (390x844)
- [ ] Video shows poster image initially
- [ ] Video autoplays after 2-3 seconds
- [ ] Form modal fits without horizontal scroll
- [ ] No text smaller than 14px
- [ ] Language switcher visible in bottom right
- [ ] Form inputs are 16px (no zoom on focus)

### Android 360x720
- [ ] Video loads or shows fallback
- [ ] All buttons 44x44px+
- [ ] No horizontal scroll
- [ ] Form keyboard doesn't cover submit

### iPad 768x1024
- [ ] Car grid shows 2 columns
- [ ] Modal centered with proper padding
- [ ] Language switcher doesn't overlap

---

## PRIORITY ORDER

1. **FIX 3** (Video upload) - FIRST - without this, hero is broken
2. **FIX 1** (Video fallback) - Add fallback immediately
3. **FIX 2** (480px breakpoint) - Mobile form becomes usable
4. **FIX 4** (Image fallback) - Optional enhancement

---

## DEPLOYMENT CHECKLIST

- [ ] Video file uploaded to `/public/videos/`
- [ ] InteractiveHero.js updated with fallback
- [ ] Home.module.css updated with 480px breakpoint
- [ ] Test on iPhone 12 Pro (390px)
- [ ] Test on Android (360px)
- [ ] Test on iPad (768px)
- [ ] No console errors in mobile browsers
- [ ] Form submits on mobile without zoom
- [ ] Video autoplays or shows fallback within 3 seconds
