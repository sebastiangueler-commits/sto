const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { loadConfig } = require('./utils/config');
const { logger } = require('./utils/logger');
const { getPool, migrate } = require('./utils/db');

async function bootstrap() {
  const config = loadConfig();
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(cors({ origin: true }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Mount routers (to be added next steps)
  app.use('/webhooks', require('./webhooks/router'));
  app.use('/api', require('./routes/router'));

  const pool = getPool(config.DATABASE_URL);
  await migrate(pool, logger);

  const server = app.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, 'API server listening');
  });

  function shutdown(signal) {
    return () => {
      logger.info({ signal }, 'Shutting down');
      server.close(() => {
        pool.end(() => process.exit(0));
      });
      // Force exit safety timer
      setTimeout(() => process.exit(1), 10000).unref();
    };
  }

  process.on('SIGINT', shutdown('SIGINT'));
  process.on('SIGTERM', shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

