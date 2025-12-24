# Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Twilio account with phone number
- Node.js (optional, for npm scripts)

## Step-by-Step Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `TWILIO_ACCOUNT_SID`: From Twilio Console
- `TWILIO_AUTH_TOKEN`: From Twilio Console
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number (E.164 format)
- `WEBHOOK_URL`: Your public webhook URL (for production)

### 2. Start n8n

```bash
docker-compose up -d
```

Or use npm script:
```bash
npm start
```

### 3. Access n8n

1. Open browser to `http://localhost:5678`
2. Create your n8n account (first time only)
3. Log in to the n8n UI

### 4. Import Workflow

1. In n8n UI, click "Add Workflow"
2. Click the three dots menu → "Import from File"
3. Select `workflows/twilio-sms-webhook.json`
4. Activate the workflow

### 5. Configure Twilio

1. Log in to [Twilio Console](https://console.twilio.com)
2. Go to Phone Numbers → Manage → Active Numbers
3. Click on your phone number
4. Under "Messaging Configuration":
   - Set "A MESSAGE COMES IN" webhook to:
     - For local testing: Use ngrok or similar tunnel
     - For production: `https://your-domain.com/webhook/twilio-sms`
   - HTTP Method: POST
5. Save

### 6. Test

Send an SMS to your Twilio number and check:
- n8n execution logs
- SMS response

## Production Deployment

For production:
1. Use a reverse proxy (nginx) with SSL
2. Set proper `WEBHOOK_URL` in `.env`
3. Use PostgreSQL instead of SQLite for better performance
4. Enable n8n authentication
5. Set up monitoring and logging

## Troubleshooting

**Webhook not receiving messages:**
- Check Twilio webhook URL is correct
- Verify n8n workflow is activated
- Check n8n logs: `docker-compose logs -f`

**n8n not starting:**
- Check if port 5678 is available
- Verify Docker is running
- Check `.env` file exists

**SMS not sending:**
- Verify Twilio credentials in `.env`
- Check Twilio account balance
- Verify phone number format (E.164)
