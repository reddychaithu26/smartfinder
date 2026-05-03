// ============================================================
//  SmartFinder – Items Routes
//  routes/items.js
// ============================================================

const express        = require('express');
const multer         = require('multer');
const path           = require('path');
const { db }         = require('../db');
const { requireLogin } = require('../middleware/auth');
const router         = express.Router();

// ── Multer setup ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

// ── My Items ────────────────────────────────────────────────
router.get('/my', requireLogin, async (req, res) => {
  await db.read();
  const mine = db.data.items.filter(i => i.reporterRoll === req.session.user.roll);
  res.render('my-items', { title: 'My Items', items: mine });
});

// ── All Items ───────────────────────────────────────────────
router.get('/all', requireLogin, async (req, res) => {
  await db.read();
  const filter = req.query.filter || 'all';
  let items = db.data.items;
  if (filter === 'lost')     items = items.filter(i => i.type === 'lost'  && !i.resolved);
  if (filter === 'found')    items = items.filter(i => i.type === 'found' && !i.resolved);
  if (filter === 'resolved') items = items.filter(i => i.resolved);
  res.render('all-items', { title: 'All Items', items, filter });
});

// ── Lost Items ──────────────────────────────────────────────
router.get('/lost', requireLogin, async (req, res) => {
  await db.read();
  const items = db.data.items.filter(i => i.type === 'lost' && !i.resolved);
  res.render('lost', { title: 'Lost Items', items });
});

// ── Found Items ─────────────────────────────────────────────
router.get('/found', requireLogin, async (req, res) => {
  await db.read();
  const items = db.data.items.filter(i => i.type === 'found' && !i.resolved);
  res.render('found', { title: 'Found Items', items });
});

// ── Raise a Concern – GET ───────────────────────────────────
router.get('/raise', requireLogin, (req, res) => {
  res.render('raise', { title: 'Raise a Concern', error: req.query.error || null });
});

// ── Raise a Concern – POST ──────────────────────────────────
router.post('/raise', requireLogin, upload.array('photos', 5), async (req, res) => {
  const { itemName, description, type } = req.body;
  if (!itemName || !description || !type)
    return res.redirect('/items/raise?error=Please+fill+all+fields');

  await db.read();
  const images = (req.files || []).map(f => '/uploads/' + f.filename);
  const newItem = {
    id:           db.data.nextId++,
    name:         itemName,
    desc:         description,
    type,
    reporterRoll: req.session.user.roll,
    reporterName: req.session.user.name,
    images,
    resolved:     false,
    date:         new Date().toLocaleDateString('en-IN')
  };
  db.data.items.push(newItem);
  await db.write();
  res.redirect('/items/my?success=Item+reported+successfully');
});

// ── Resolve Item ────────────────────────────────────────────
router.post('/resolve/:id', requireLogin, async (req, res) => {
  await db.read();
  const item = db.data.items.find(i => i.id === parseInt(req.params.id));
  if (item && item.reporterRoll === req.session.user.roll) {
    item.resolved = true;
    await db.write();
  }
  res.redirect('/items/my');
});

module.exports = router;
