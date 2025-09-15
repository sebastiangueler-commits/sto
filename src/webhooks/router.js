const express = require('express');
const { logger } = require('../utils/logger');

const router = express.Router();

router.post('/whatsapp', async (req, res) => {
  logger.info({ body: req.body }, 'Received WhatsApp webhook');
  // Placeholder: will implement Twilio inbound processing
  res.sendStatus(200);
});

router.post('/mercadopago', async (req, res) => {
  logger.info({ body: req.body }, 'Received Mercado Pago webhook');
  // Placeholder: will implement signature validation and payment handling
  res.sendStatus(200);
});

module.exports = router;

