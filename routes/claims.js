// ============================================================
//  SmartFinder – Claims Routes
//  routes/claims.js
// ============================================================

const express          = require('express');
const { db }           = require('../db');
const { requireLogin } = require('../middleware/auth');
const router           = express.Router();

// ── View all claims ─────────────────────────────────────────
router.get('/claimers', requireLogin, async (req, res) => {
  await db.read();
  res.render('claimers', { title: 'Claimers List', claims: db.data.claims });
});

// ── Submit a claim ──────────────────────────────────────────
router.post('/claim/:itemId', requireLogin, async (req, res) => {
  const { claimName, claimMobile, claimHostel } = req.body;
  const itemId = parseInt(req.params.itemId);

  if (!claimName || !claimMobile || !claimHostel)
    return res.redirect('/items/found?error=Please+fill+all+claim+fields');

  await db.read();
  const item = db.data.items.find(i => i.id === itemId);
  if (!item) return res.redirect('/items/found');

  db.data.claims.push({
    id:       db.data.nextId++,
    itemId,
    itemName: item.name,
    name:     claimName,
    mobile:   claimMobile,
    hostel:   claimHostel,
    claimerRoll: req.session.user.roll,
    date:     new Date().toLocaleString('en-IN')
  });
  await db.write();
  res.redirect('/items/found?success=Claim+submitted+successfully');
});

module.exports = router;
