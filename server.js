import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import handler from './api/create-checkout.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Resend Email API integration
app.post('/api/send-email', async (req, res) => {
  const { customerEmail, subject, adminSubject, html, adminHtml } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bookings@cardifftaxisltd.co.uk';

  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    // 1. Send to Customer
    const customerPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Cardiff Taxis LTD <bookings@cardifftaxisltd.co.uk>',
        to: customerEmail,
        subject: subject,
        html: html,
      }),
    });

    // 2. Send to Admin
    const adminPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Cardiff Taxis LTD <bookings@cardifftaxisltd.co.uk>',
        to: ADMIN_EMAIL,
        subject: adminSubject || `🚨 NEW BOOKING: ${subject}`,
        html: adminHtml || html,
      }),
    });

    const [customerRes, adminRes] = await Promise.all([customerPromise, adminPromise]);
    
    if (customerRes.ok && adminRes.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: "One or more emails failed to send" });
    }
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mock Vercel/Netlify environment for the handler
app.post('/api/create-checkout', async (req, res) => {
  const customRes = {
    status: (code) => {
      res.status(code);
      return customRes;
    },
    json: (data) => {
      res.json(data);
      return customRes;
    }
  };
  await handler(req, customRes);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});
