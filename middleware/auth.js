const crypto = require('crypto');

const hashPassword = (password = '') =>
  crypto.createHash('sha512').update(password).digest('hex');

const setFlash = (req, type, message) => {
  req.session.flash = { type, message };
};

const ensureLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  setFlash(req, 'warning', 'A kért oldalhoz előbb jelentkezz be.');
  res.redirect('/auth/login');
};

const ensureAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    message: 'Nincs jogosultságod az oldal megtekintéséhez.',
    error: {},
  });
};

const exposeUser = (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
};

module.exports = {
  ensureLoggedIn,
  ensureAdmin,
  hashPassword,
  setFlash,
  exposeUser,
};
