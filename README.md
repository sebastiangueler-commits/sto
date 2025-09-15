## WhatsApp Contract Bot – Ready-to-Deploy

End-to-end WhatsApp bot to create contracts, generate dynamic PDFs, collect payments, run payouts/split fees, send reminders, and keep auditable logs.

### Quick start

1. Copy environment file and edit values:

```bash
cp .env.example .env
```

2. Build and start services:

```bash
docker-compose up -d --build
```

3. Health check:

```bash
curl -fsSL http://localhost:3000/health
```

### Services
- API: Node.js + Express (port 3000)
- DB: Postgres (port 5432)
- Reverse proxy: Caddy (80/443) with automatic HTTPS when `DOMAIN` is public

### Required configuration
- Twilio WhatsApp: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
- Mercado Pago: `MP_ACCESS_TOKEN`, optionally `MP_WEBHOOK_SECRET`, `MP_APP_ID`
- Database: `DATABASE_URL` or `POSTGRES_*`
- JWT for signed URLs: `JWT_SECRET`

### Webhooks
- WhatsApp inbound: `POST /webhooks/whatsapp`
- Mercado Pago: `POST /webhooks/mercadopago`

### Payments
By default, creates a Mercado Pago preference with `external_reference = contract_id`. On payment approval (webhook), the bot confirms to payer and receiver and records events. Optional split fee/payout is supported when your PSP account is configured for marketplace/application_fee or payouts.

### PDFs
PDFs are generated on-demand from HTML templates and delivered to WhatsApp as media via a short-lived signed URL. No files are stored persistently.

### Development
Run the API only:

```bash
npm ci
npm run dev
```

### License
MIT

# sto