// ============================================================
//  SmartFinder – Helpers Routes
//  routes/helpers.js
// ============================================================

const express          = require('express');
const { db }           = require('../db');
const { requireLogin } = require('../middleware/auth');
const router           = express.Router();

router.get('/', requireLogin, async (req, res) => {
  await db.read();
  res.render('helpers', { title: 'Helpers List', helpers: db.data.helpers });
});

module.exports = router;
