const express = require('express');
const router = express.Router();
const { findByUsername, createUser, verifyUser } = require('../models/userModel');
const { setFlash } = require('../middleware/auth');

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Bejelentkezés' });
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await verifyUser(username, password);
    if (!user) {
      setFlash(req, 'danger', 'Hibás felhasználónév vagy jelszó.');
      return res.redirect('/app117/auth/login');
    }
    req.session.user = user;
    setFlash(req, 'success', `Szia ${user.username}, üdv újra!`);
    res.redirect('/app117');
  } catch (err) {
    next(err);
  }
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Regisztráció' });
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      setFlash(req, 'warning', 'Adj meg felhasználónevet és jelszót.');
      return res.redirect('/app117/auth/register');
    }
    const existing = await findByUsername(username);
    if (existing) {
      setFlash(req, 'warning', 'Ez a felhasználónév már foglalt.');
      return res.redirect('/app117/auth/register');
    }
    await createUser(username, password, 'registered');
    setFlash(req, 'success', 'Sikeres regisztráció, most már be is jelentkezhetsz.');
    res.redirect('/app117/auth/login');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('session_cookie_name');
    res.redirect('/app117');
  });
});

module.exports = router;
