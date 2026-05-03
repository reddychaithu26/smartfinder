// ============================================================
//  SmartFinder – Auth Middleware
//  middleware/auth.js
// ============================================================

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/signin?error=Please+sign+in+to+continue');
}

module.exports = { requireLogin };
