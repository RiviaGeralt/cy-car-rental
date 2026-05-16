/**
 * API Route: Upload video to Vercel Blob Storage
 * Endpoint: POST /api/upload-video
 *
 * Optional: Use this for programmatic uploads from admin panel
 * Requires BLOB_READ_WRITE_TOKEN environment variable
 */

import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb', // Allow large video uploads
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, blob } = req.body;

    if (!filename || !blob) {
      return res.status(400).json({ error: 'Missing filename or blob data' });
    }

    // Validate token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'Blob storage not configured' });
    }

    // Upload to Vercel Blob
    const response = await put(filename, Buffer.from(blob, 'base64'), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({
      success: true,
      url: response.url,
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
}
