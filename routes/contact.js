const express = require('express');
const router = express.Router();
const { ensureLoggedIn, setFlash } = require('../middleware/auth');
const { saveMessage, listMessages } = require('../models/messageModel');

router.get('/', (req, res) => {
  res.render('contact', { title: 'Kapcsolat' });
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      setFlash(req, 'warning', 'Minden mező kitöltése kötelező.');
      return res.redirect('/app117/kapcsolat');
    }
    await saveMessage({
      name,
      email,
      message,
      userId: req.session.user?.id || null,
    });
    setFlash(req, 'success', 'Köszönjük, az üzenetedet elmentettük és továbbítottuk.');
    res.redirect('/app117/kapcsolat');
  } catch (err) {
    next(err);
  }
});

router.get('/uzenetek', ensureLoggedIn, async (req, res, next) => {
  try {
    const messages = await listMessages();
    res.render('messages', { title: 'Bejövő üzenetek', messages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
