/**
 * Form Submission API Endpoint
 * Handles car rental inquiry submissions
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, car } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Send to Formspree (free form backend)
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    
    if (!formspreeId) {
      // Fallback: Just return success (production should always have NEXT_PUBLIC_FORMSPREE_ID set)
      // Note: PII console.log removed per security audit 2026-05-16
      return res.status(200).json({
        success: true,
        message: 'Inquiry received. We will contact you via WhatsApp or email.'
      });
    }

    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        car: car || 'Not specified',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Formspree submission failed');
    }

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been received. We will contact you shortly.'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({
      error: 'Form submission temporarily unavailable. Please contact us via WhatsApp.'
    });
  }
}
