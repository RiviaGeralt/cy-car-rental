# Video Hero Deployment Guide

## Quick Start (5 minutes)

### Step 1: Install Vercel Blob Storage (Free)

1. Go to: https://vercel.com/dashboard/stores?type=blob
2. Click **"Create New Store"**
3. Choose **Region**: Europe/Zurich (closest to Cyprus)
4. Click **"Create"**
5. Copy the **Blob Token** → You'll need this later

### Step 2: Upload Your Video

**Option A: Via CLI Script (Recommended)**

```bash
# Prepare your video file (1-30 seconds recommended)
# Place it in: ./public/videos/hero.mp4

# Set your blob token
export BLOB_READ_WRITE_TOKEN=YOUR_TOKEN_HERE

# Run upload script
node scripts/upload-video.js ./public/videos/hero.mp4

# Output will show:
# ✅ Upload successful!
# 📍 URL: https://your-blob-id.public.blob.vercel-storage.com/cy-rental-hero-video.mp4
```

**Option B: Via Vercel Dashboard**

1. Go to Blob Store dashboard
2. Click **"Upload File"**
3. Select your video file (MP4 format)
4. Copy the public URL

### Step 3: Configure Environment

Update `.env.local`:

```
NEXT_PUBLIC_BLOB_VIDEO_URL=https://your-blob-id.public.blob.vercel-storage.com/cy-rental-hero-video.mp4
```

### Step 4: Test Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit: http://localhost:3000
# Check: Hero video should play (no black screen)
# Check: Video autoplay works on desktop
# Check: Mobile version shows fallback gracefully
```

### Step 5: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add interactive video hero section with Vercel Blob storage"

# Push to GitHub
git push origin main

# Vercel auto-deploys → Check https://cy-rental-work.vercel.app
```

---

## Safety Checklist (Before Production)

✅ **Environment Variables**
- [ ] `NEXT_PUBLIC_BLOB_VIDEO_URL` set in `.env.local`
- [ ] Same value in Vercel Dashboard → Settings → Environment Variables
- [ ] Token NOT in git (only in dashboard)

✅ **Code Quality**
- [ ] `npm run build` succeeds locally
- [ ] `npm run lint` passes (no errors)
- [ ] Component renders without console errors

✅ **Video Quality**
- [ ] Video file is MP4 (H.264 codec)
- [ ] Duration: 5-30 seconds (optimal)
- [ ] File size: < 50 MB (fast loading)
- [ ] Resolution: 1920x1080 or higher

✅ **Browser Testing**
- [ ] Desktop Chrome: Video plays, parallax works
- [ ] Desktop Firefox: Video plays
- [ ] Desktop Safari: Video plays
- [ ] Mobile Safari (iOS): Shows fallback, no errors
- [ ] Chrome Mobile (Android): Shows fallback, no errors

✅ **Deployment Safety**
- [ ] Git branch is clean (no uncommitted changes)
- [ ] GitHub push succeeds
- [ ] Vercel build completes (check dashboard)
- [ ] No new warnings in Vercel logs
- [ ] Lighthouse score > 85 (performance)

✅ **CORS & Security**
- [ ] No 403/CORS errors in console
- [ ] CSP headers intact (check Network tab)
- [ ] Video URL uses HTTPS only

---

## Rollback (If Something Goes Wrong)

### Quick Rollback (1 minute)

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel auto-deploys without video hero
# Site is live again
```

### Full Rollback (5 minutes)

```bash
# Find last known good commit
git log --oneline | head -5

# Checkout that commit
git checkout COMMIT_HASH

# Force push (careful!)
git push origin main --force

# Vercel rebuilds from old state
```

---

## Troubleshooting

### Problem: Black Screen on Production

**Cause**: Video URL not loading (CORS, 404, etc.)

**Fix**:
1. Check console (F12) → Network tab → find video request
2. Verify URL in `.env.local` is correct
3. Test URL directly in browser (should show download prompt)
4. If 404: re-upload video to Blob store
5. If CORS: ensure `NEXT_PUBLIC_BLOB_VIDEO_URL` is in Vercel dashboard

### Problem: Video Doesn't Autoplay

**Cause**: Mobile browser restrictions (iOS Safari requires muted + specific attributes)

**Expected behavior**: Desktop autoplays video, mobile shows fallback (no video)

**This is correct** — Mobile video autoplay is restricted by iOS/Android for user experience

### Problem: Vercel Build Fails

**Cause**: Missing dependency or environment variable

**Fix**:
1. Check Vercel logs: https://vercel.com/dashboard/cy-rental-work/deployments
2. Ensure `@vercel/blob` in `package.json`
3. Ensure `NEXT_PUBLIC_BLOB_VIDEO_URL` in Vercel Dashboard
4. Run `npm install` locally and test

### Problem: Slow Video Load

**Cause**: Large file size or Blob token issues

**Fix**:
1. Compress video: `ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 output.mp4`
2. Check Blob storage stats (dashboard)
3. Use smaller dimensions (1280x720 instead of 4K)

---

## Video Optimization Tips

### Compress Video (Before Upload)

Using FFmpeg:

```bash
# General compression (good quality)
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4

# High compression (smaller file)
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 96k output.mp4

# Ultra-fast (minimal quality loss)
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k output.mp4
```

### Recommended Settings

- **Codec**: H.264 (MP4) — universal browser support
- **Resolution**: 1920x1080 or 1280x720 (1080 looks better, 720 loads faster)
- **Duration**: 5-15 seconds (optimal for hero section)
- **File Size**: 5-20 MB (fast loading, good quality)
- **Frame Rate**: 30 fps (standard)

---

## Performance Metrics

After deployment, monitor:

- **Video Load Time**: < 2 seconds (Blob CDN handles this)
- **Page Load Time**: < 3 seconds (with video)
- **Lighthouse Performance**: > 85 (video cached by Blob)
- **Video Play Start**: Immediate (muted autoplay)

Check metrics:
- Vercel Dashboard → Analytics
- Google Analytics → Core Web Vitals
- Browser DevTools → Lighthouse

---

## Support

If anything breaks:

1. Check this guide's troubleshooting section
2. Review Vercel logs: https://vercel.com/dashboard
3. Test locally: `npm run dev`
4. Verify video URL loads in browser directly
5. If persistent: rollback using the Rollback section above

---

**Video Hero Integration**: ✅ Complete  
**Deployment Status**: Ready for production  
**Last Updated**: 2026-05-16
