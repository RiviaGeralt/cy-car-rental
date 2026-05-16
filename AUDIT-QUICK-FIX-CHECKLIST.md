# MOBILE AUDIT - QUICK FIX CHECKLIST

## 3 CRITICAL FIXES NEEDED

### [ ] FIX 1: Video File Upload (5 min)
- [ ] Create: `/public/videos/` directory
- [ ] Add: `hero-north-cyprus-ai.mp4` file
- [ ] Verify: File loads without 404 error
- [ ] OR set env: `NEXT_PUBLIC_BLOB_VIDEO_URL=<url>`

**Test**: `curl http://localhost:3000/videos/hero-north-cyprus-ai.mp4`
Should return: video file, not 404

---

### [ ] FIX 2: Add Video Fallback (10 min)
**File**: `components/InteractiveHero.js` line 57-60

Replace:
```jsx
<video className="hero-video" autoPlay muted loop playsInline preload="metadata">
  <source src={videoUrl} type="video/mp4" />
</video>
```

With:
```jsx
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
</video>
```

**Test**: Visit http://localhost:3000, hero should show dark background (poster) while video loads

---

### [ ] FIX 3: Add 480px Breakpoint (15 min)
**File**: `styles/Home.module.css`

**Add at end of file** (before closing comment):

```css
/* Mobile phones (480px and below) */
@media (max-width: 480px) {
  /* Form Modal - CRITICAL */
  .modalContent {
    padding: 30px 20px;
    max-width: 95vw;
  }

  .modalContent h3 {
    font-size: 1.4rem;
  }

  /* iOS Zoom Prevention */
  .form input,
  .form textarea {
    font-size: 16px;
  }

  /* Touch Targets */
  .closeBtn {
    width: 44px;
    height: 44px;
  }

  /* Typography */
  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  /* Hero Padding */
  .hero {
    padding: 50px 20px;
    margin: 20px 0;
  }

  /* Language Switcher */
  .sideLangSwitcher {
    right: 10px;
    top: auto;
    bottom: 20px;
    flex-direction: row;
  }

  /* Car Grid */
  .carsGrid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* Fleet Section */
  .fleet {
    padding: 40px 20px;
  }

  /* CTA Buttons Stack */
  .ctaButtons {
    flex-direction: column;
  }

  .ctaButton,
  .ctaButtonSecondary {
    width: 100%;
  }
}
```

**Test**: 
- Open DevTools → set viewport to 375px width
- Form modal should have proper padding
- Text should be readable
- Language switcher should move to bottom

---

## VALIDATION TESTS

### After all fixes, test on:

#### iPhone 12 Pro (390x844)
- [ ] Video shows (either playing or showing poster image)
- [ ] No horizontal scroll
- [ ] Form modal fits without scrolling
- [ ] Form inputs are readable
- [ ] Close button (X) is easy to tap
- [ ] Language switcher visible, not overlapping

#### Android 360x720
- [ ] Video loads (autoplay or fallback)
- [ ] All buttons are 44px+ tall
- [ ] Form keyboard doesn't cover submit button
- [ ] No horizontal scroll

#### iPad 768x1024
- [ ] Car grid shows 2 columns
- [ ] Modal has good padding
- [ ] Everything readable

---

## BEFORE/AFTER COMPARISON

### BEFORE FIXES:
```
iPhone 12 (390px):
- Hero: Black screen with 404 video error
- Form: Modal padding 50px = 290px usable space (too cramped)
- Language switcher: Positioned at right: 25px (overlaps content)
- Form inputs: Font-size 15.2px (triggers iOS zoom)
- Result: User bounces, never submits form
```

### AFTER FIXES:
```
iPhone 12 (390px):
- Hero: Shows video or dark poster while loading
- Form: Modal padding 30px 20px = 350px usable space (readable)
- Language switcher: Positioned at bottom, flex-direction: row (no overlap)
- Form inputs: Font-size 16px (no zoom)
- Result: User can see and submit form on mobile
```

---

## IMPACT BY SCREEN SIZE

| Device | Issue | Fix Applied | Result |
|--------|-------|------------|--------|
| iPhone SE (375px) | Modal padding 50px = 275px space | Padding 30px 20px | 335px space ✓ |
| iPhone 12 (390px) | Font size 15.2px = iOS zoom | Font size 16px | No zoom ✓ |
| Pixel 4 (360px) | Language switcher overlaps | Moved to bottom | Visible ✓ |
| iPad (768px) | Works fine | No change needed | Good ✓ |
| Desktop (1920px) | Works fine | No change needed | Good ✓ |

---

## COMMIT MESSAGE

```
fix: mobile responsive issues and video fallback

- Add video 404 error handling with fallback poster image
- Add 480px media query for form modal, typography, and layout
- Prevent iOS zoom by setting form input font-size to 16px
- Increase close button to 44x44px touch target
- Reposition language switcher to bottom on mobile
- Improve hero padding for phones under 480px
- Ensure all buttons are accessible touch targets (44x44px+)

Fixes mobile blockers preventing form submission on iPhone/Android.
Test on 390px (iPhone 12) and 360px (Pixel) viewports.
```

---

## ROLLBACK PLAN

If something breaks after fixes:
1. Remove 480px media query block
2. Revert InteractiveHero.js video element to original
3. Redeploy

All changes are additive, safe to roll back.

---

## ESTIMATED TIMELINE

| Task | Time | Status |
|------|------|--------|
| Upload video file | 5 min | [ ] |
| Add video fallback | 10 min | [ ] |
| Add 480px breakpoint | 15 min | [ ] |
| Test on mobile | 15 min | [ ] |
| Fix any issues | 10 min | [ ] |
| **TOTAL** | **~45 min** | [ ] |

---

## SUCCESS CRITERIA

✓ Form modal is usable on 390px screens without horizontal scroll
✓ Video loads without 404 error (or shows fallback)
✓ Form inputs don't trigger iOS zoom
✓ All touch targets are 44x44px minimum
✓ No console errors on mobile
✓ Form submits successfully from iPhone or Android

---

**DO NOT DEPLOY TO PRODUCTION** without checking all three fixes above.
