# Webhook Handler

Basic Express.js webhook handler for receiving Twilio SMS messages.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

The webhook will be available at `http://localhost:3000/webhook/sms`

## Testing Locally

Use ngrok to expose your local server:
```bash
ngrok http 3000
```

Then configure Twilio to send webhooks to:
```
https://your-ngrok-url.ngrok.io/webhook/sms
```

## Endpoints

- `GET /health` - Health check endpoint
- `POST /webhook/sms` - Twilio SMS webhook endpoint

## What It Does

- Receives POST requests from Twilio
- Extracts `From`, `Body`, `To`, and `MessageSid` fields
- Logs the incoming message to console
- Returns HTTP 200 response
