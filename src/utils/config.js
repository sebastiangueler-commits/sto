require('dotenv').config();

function must(name, value) {
  if (!value || String(value).trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function loadConfig() {
  const PORT = Number(process.env.PORT || 3000);
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const DATABASE_URL = must('DATABASE_URL', process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER || 'contractbot'}:${process.env.POSTGRES_PASSWORD || 'contractbot'}@${process.env.POSTGRES_HOST || 'db'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'contractbot'}`);

  const JWT_SECRET = must('JWT_SECRET', process.env.JWT_SECRET || 'change-me-please-32bytes');
  const BASE_URL = must('BASE_URL', process.env.BASE_URL || 'http://localhost');

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
  const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || '';

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
  const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || '';
  const MP_APP_ID = process.env.MP_APP_ID || '';

  return {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    BASE_URL,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM,
    MP_ACCESS_TOKEN,
    MP_WEBHOOK_SECRET,
    MP_APP_ID,
  };
}

module.exports = { loadConfig };

