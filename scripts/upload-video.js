#!/usr/bin/env node
/**
 * Upload video to Vercel Blob Storage
 * Usage: node scripts/upload-video.js <video-file-path>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BLOB_API_URL = 'https://blob.vercel-storage.com';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const VIDEO_FILENAME = 'cy-rental-hero-video.mp4';

async function uploadToBlob(filePath) {
  if (!BLOB_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not set');
    console.error('   Get token from: https://vercel.com/dashboard/stores?type=blob');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const fileSize = fs.statSync(filePath).size;
  const fileSizeMb = (fileSize / (1024 * 1024)).toFixed(2);

  console.log(`📤 Uploading video: ${path.basename(filePath)} (${fileSizeMb} MB)`);

  const fileStream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLOB_TOKEN}`,
        'Content-Type': 'video/mp4',
        'x-add-random-suffix': 'false',
      },
    };

    const req = https.request(`${BLOB_API_URL}/${VIDEO_FILENAME}`, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('✅ Upload successful!');
            console.log(`📍 URL: ${response.url}`);
            console.log(`\n📋 Add this to .env.local:`);
            console.log(`NEXT_PUBLIC_BLOB_VIDEO_URL=${response.url}`);
            resolve(response.url);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', reject);
    fileStream.pipe(req);
  });
}

// Run upload
const videoPath = process.argv[2];
if (!videoPath) {
  console.error('Usage: node scripts/upload-video.js <path-to-video-file>');
  console.error('Example: node scripts/upload-video.js ./public/videos/hero.mp4');
  process.exit(1);
}

uploadToBlob(videoPath)
  .then(() => {
    console.log('\n✨ Ready to deploy!');
    console.log('1. Update .env.local with the URL above');
    console.log('2. Run: npm run build && npm start');
    console.log('3. Test locally, then push to GitHub');
    console.log('4. Vercel will auto-deploy with your video');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`\n❌ Upload failed: ${err.message}`);
    process.exit(1);
  });
