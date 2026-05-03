// ============================================================
//  SmartFinder – Lost & Found Tracking System
//  server.js  –  Main Express Application Entry Point
// ============================================================

const express       = require('express');
const session       = require('express-session');
const path          = require('path');
const fs            = require('fs');

const { db, initDb } = require('./db');
const authRoutes    = require('./routes/auth');
const itemRoutes    = require('./routes/items');
const helperRoutes  = require('./routes/helpers');
const claimRoutes   = require('./routes/claims');

const app  = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'smartfinder-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/',        authRoutes);
app.use('/items',   itemRoutes);
app.use('/helpers', helperRoutes);
app.use('/',        claimRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log('\n✅  SmartFinder is running!');
    console.log('🌐  Open: http://localhost:' + PORT);
    console.log('\n📋  Demo Login:');
    console.log('    Roll No : 23881A05GM');
    console.log('    Password: demo123\n');
  });
}).catch(err => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
