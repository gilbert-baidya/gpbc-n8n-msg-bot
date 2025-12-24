# Church SMS Chatbot

A simple SMS chatbot for church communications using Twilio webhooks and Node.js.

## Purpose

Provides automated SMS responses for:
- Service times and location
- Prayer requests
- Information about Jesus
- General inquiries

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=3000
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

3. **Run locally:**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Connecting Twilio

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to Phone Numbers → Active Numbers
3. Select your phone number
4. Under "Messaging Configuration":
   - Set "A MESSAGE COMES IN" webhook to: `https://your-domain.com/webhook/sms`
   - Method: HTTP POST
5. Save

### Local Testing with ngrok

```bash
ngrok http 3000
```

Use the ngrok URL in Twilio: `https://abc123.ngrok.io/webhook/sms`

## Available Commands

Users can text:
- `hi` or `hello` - Welcome message
- `service` - Service times and location
- `prayer` - Prayer request information
- `jesus` - Gospel message
- Any other text - Help message

## Docker

Build and run:
```bash
docker build -t church-chatbot .
docker run -p 3000:3000 --env-file .env church-chatbot
```

## Project Structure

```
├── src/
│   └── server.js        # Main webhook server
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # n8n setup (optional)
├── package.json
└── .env                 # Environment variables
```
# gpbc-n8n-msg-bot
