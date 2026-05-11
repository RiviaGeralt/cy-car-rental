// API route to securely submit form to Formspree
// Keeps FORM_ENDPOINT hidden from browser (not exposed in DevTools)

const FORM_ENDPOINT = process.env.FORM_ENDPOINT;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, car } = req.body;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Strict email validation (RFC-compliant)
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate phone (E.164 international format or Cyprus)
  const cleanPhone = phone.replace(/\D/g, '');
  const PHONE_REGEX = /^357[0-9]{8}$/; // Cyprus: +357XXXXXXXX
  const INTL_PHONE_REGEX = /^[1-9]\d{1,14}$/; // E.164: +1-based or any country

  if (!PHONE_REGEX.test(cleanPhone) && !INTL_PHONE_REGEX.test(cleanPhone)) {
    return res.status(400).json({ error: 'Invalid phone format' });
  }

  // Validate message length
  const MAX_MESSAGE_LENGTH = 500;
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` });
  }

  // Prepare form data for Formspree
  const formData = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message ? message.trim() : '(no message)',
    car: car || '(not specified)',
  };

  try {
    // Submit to Formspree
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error('Formspree error:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to submit form. Please try again.' });
    }

    // Success
    console.log(`Form submitted: ${formData.email} for ${formData.car}`);
    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ error: 'Network error. Please try again later.' });
  }
}
