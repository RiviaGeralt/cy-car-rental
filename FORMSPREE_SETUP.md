# Formspree Setup Guide — Cyprus Road

## What This Does
When users fill out the "Inquire Now" form on the website, their message will be **emailed directly to you** at `majd.bannoura123@hotmail.com`.

---

## ✅ STEP 1: Create Formspree Account (2 min)

1. Open https://formspree.io
2. Click **"Sign Up"**
3. Use email: `majd.bannoura123@hotmail.com`
4. Set a password
5. Click **"Create Account"**

---

## ✅ STEP 2: Create Your Form (2 min)

1. After login, click **"New Form"**
2. Give it a name: `Cyprus Road Inquiry`
3. Click **"Create"**
4. **Copy your Form ID** — it will look like: `f/abc123xyz`

---

## ✅ STEP 3: Update Code with Form ID (1 min)

In `pages/index.js`, find this line:
```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Replace `YOUR_FORM_ID` with your actual ID from Step 2.

**Example:**
```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/mx0dkqyo';
```

---

## ✅ STEP 4: Add WhatsApp Number (1 min)

In `pages/index.js`, find this line:
```javascript
const WHATSAPP_NUMBER = '+357XXXXXXX';
```

Replace with your actual WhatsApp number.

**Example:**
```javascript
const WHATSAPP_NUMBER = '+35799123456';
```

---

## ✅ STEP 5: Deploy (2 min)

```bash
cd cy-rental-work
git add .
git commit -m "Set up Formspree email backend and WhatsApp"
git push
```

Vercel will auto-deploy. Check https://cy-rental-work.vercel.app to confirm.

---

## ✅ Test the Form

1. Go to website
2. Click **"Inquire Now"** on any car
3. Fill out the form
4. Click **"Send Inquiry"**
5. Check your email — you should receive the inquiry within 1 minute

---

## Troubleshooting

**Form not sending?**
- Check that `FORM_ENDPOINT` has your correct Form ID
- Check Formspree dashboard to see submissions

**WhatsApp button not working?**
- Ensure WhatsApp number includes country code (e.g., +357 for Cyprus)
- Only numbers and + sign — no spaces

---

**Questions?** Check Formspree docs: https://formspree.io/help

