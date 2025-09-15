const { Pool } = require('pg');

let cachedPool;

function getPool(databaseUrl) {
  if (cachedPool) return cachedPool;
  cachedPool = new Pool({ connectionString: databaseUrl, max: 10 });
  return cachedPool;
}

async function migrate(pool, logger) {
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      cvu_cbu TEXT,
      kyc_status TEXT DEFAULT 'unverified',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL,
      payer_id UUID REFERENCES users(id),
      receiver_id UUID REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'draft',
      fee_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
      amount NUMERIC(18,2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'ARS',
      description TEXT,
      due_date DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      contract_id UUID REFERENCES contracts(id),
      payer_id UUID REFERENCES users(id),
      amount NUMERIC(18,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ARS',
      mp_payment_id TEXT,
      status TEXT NOT NULL,
      payout_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      contract_id UUID REFERENCES contracts(id),
      event_type TEXT NOT NULL,
      payload_json JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      contract_id UUID REFERENCES contracts(id),
      reminder_type TEXT NOT NULL,
      scheduled_at TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'scheduled'
    );

    CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
    CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
    CREATE INDEX IF NOT EXISTS idx_events_contract ON events(contract_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(status, scheduled_at);
  `);

  logger.info('Database schema ensured');
}

module.exports = { getPool, migrate };

