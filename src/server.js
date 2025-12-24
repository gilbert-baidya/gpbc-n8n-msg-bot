const express = require('express');
const bodyParser = require('body-parser');

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const responses = require('./responses');
const normalizeInput = require('./utils');

const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// Middleware - Parse Twilio's application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Twilio SMS Webhook Handler
app.post('/webhook/sms', (req, res) => {
  try {
    // Extract Twilio parameters
    const from = req.body.From || '';
    const to = req.body.To || '';
    const body = req.body.Body || '';
    const messageSid = req.body.MessageSid || '';

    // Normalize input (lowercase, trimmed)
    const userInput = normalizeInput(body);

    // Log incoming message
    console.log('--- Incoming SMS ---');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Message: ${body}`);
    console.log(`Normalized: ${userInput}`);
    console.log(`MessageSid: ${messageSid}`);

    // Handle empty messages safely
    if (!userInput) {
      console.log('Empty message received');
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responses.fallbackMessage}</Message>
</Response>`;
      return res.type('text/xml').status(200).send(twiml);
    }

    // Command routing - Exact string matching only
    let responseMessage;

    switch (userInput) {
      case 'hi':
      case 'hello':
        responseMessage = responses.welcomeMessage;
        break;
      case 'service':
        responseMessage = responses.serviceInfo;
        break;
      case 'prayer':
        responseMessage = responses.prayerRequest;
        break;
      case 'jesus':
        responseMessage = responses.aboutJesus;
        break;
      case 'help':
        responseMessage = responses.helpMessage;
        break;
      case 'pastor':
        responseMessage = responses.pastorMessage;
        break;
      case 'stop':
      case 'unsubscribe':
        responseMessage = responses.unsubscribeMessage;
        break;
      default:
        // Unknown command - safe fallback
        responseMessage = responses.fallbackMessage;
    }

    console.log(`Response: ${responseMessage}`);

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;

    res.type('text/xml').status(200).send(twiml);
  } catch (error) {
    // Never crash - always return valid TwiML
    console.error('Error processing webhook:', error);
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responses.fallbackMessage}</Message>
</Response>`;
    res.type('text/xml').status(200).send(errorTwiml);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('==============================');
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook endpoint: /webhook/sms`);
  console.log(`Twilio Account SID: ${TWILIO_ACCOUNT_SID ? 'CONFIGURED' : 'NOT SET'}`);
  console.log(`Twilio Phone Number: ${TWILIO_PHONE_NUMBER || 'NOT SET'}`);
  console.log('==============================');
});
