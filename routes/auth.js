// ============================================================
//  SmartFinder – Auth Routes
//  routes/auth.js
// ============================================================

const express = require('express');
const bcrypt  = require('bcryptjs');
const { db }  = require('../db');
const router  = express.Router();

// ── Home ────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const items    = db.data.items;
  const stats = {
    lost:     items.filter(i => i.type === 'lost'  && !i.resolved).length,
    found:    items.filter(i => i.type === 'found' && !i.resolved).length,
    resolved: items.filter(i => i.resolved).length
  };
  res.render('home', { title: 'Home', stats });
});

// ── Sign Up ─────────────────────────────────────────────────
router.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup', { title: 'Sign Up', error: req.query.error || null });
});

router.post('/signup', async (req, res) => {
  const { name, roll, email, password, confirm } = req.body;

  if (!name || !roll || !email || !password)
    return res.redirect('/signup?error=Please+fill+all+fields');
  if (password !== confirm)
    return res.redirect('/signup?error=Passwords+do+not+match');
  if (password.length < 6)
    return res.redirect('/signup?error=Password+must+be+at+least+6+characters');

  await db.read();
  if (db.data.users.find(u => u.roll === roll))
    return res.redirect('/signup?error=Roll+number+already+registered');

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id:        db.data.nextId++,
    name, roll, email,
    password:  hashed,
    createdAt: new Date().toISOString()
  };
  db.data.users.push(newUser);
  await db.write();

  req.session.user = { id: newUser.id, name, roll, email };
  res.redirect('/?success=Account+created+successfully');
});

// ── Sign In ─────────────────────────────────────────────────
router.get('/signin', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signin', { title: 'Sign In', error: req.query.error || null });
});

router.post('/signin', async (req, res) => {
  const { roll, password } = req.body;
  await db.read();

  const user = db.data.users.find(u => u.roll === roll);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.redirect('/signin?error=Invalid+roll+number+or+password');

  req.session.user = { id: user.id, name: user.name, roll: user.roll, email: user.email };
  const returnTo   = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// ── Logout ──────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
