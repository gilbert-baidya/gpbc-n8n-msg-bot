const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const twilio = require('twilio');

const responses = require('./responses');
const normalizeInput = require('./utils');

const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Middleware (Twilio sends form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ===============================
// Twilio SMS Webhook
// ===============================
app.post('/webhook/sms', async (req, res) => {
  const from = req.body.From;
  const to = req.body.To;
  const body = req.body.Body || '';
  const messageSid = req.body.MessageSid;

  const userInput = normalizeInput(body);

  console.log('------------------------------');
  console.log('--- Incoming SMS ---');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Original Message: ${body}`);
  console.log(`Normalized Input: ${userInput}`);
  console.log(`MessageSid: ${messageSid}`);
  console.log('------------------------------');

  if (!userInput) {
    return res.status(200).send('OK');
  }

  // Command routing (STRICT & SAFE)
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
      responseMessage = responses.fallbackMessage;
  }

  console.log(`Response Selected: ${responseMessage}`);

  // ===============================
  // SEND SMS USING TWILIO REST API
  // ===============================
  try {
    const message = await client.messages.create({
      body: responseMessage,
      from: TWILIO_PHONE_NUMBER,
      to: from
    });

    console.log(`SMS sent successfully: ${message.sid}`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).send('SMS send failed');
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
