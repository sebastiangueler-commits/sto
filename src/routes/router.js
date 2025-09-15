const express = require('express');
const { getPool } = require('../utils/db');
const { loadConfig } = require('../utils/config');

const config = loadConfig();
const pool = getPool(config.DATABASE_URL);

const router = express.Router();

router.get('/contracts/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
  if (rows.length === 0) return res.sendStatus(404);
  res.json(rows[0]);
});

module.exports = router;

