const express = require('express');
const router = express.Router();
const { ensureAdmin, setFlash } = require('../middleware/auth');
const {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  findSubject,
} = require('../models/subjectModel');

router.get('/', ensureAdmin, async (req, res, next) => {
  try {
    const subjects = await listSubjects();
    res.render('crud', { title: 'Vizsgatárgyak kezelése', subjects });
  } catch (err) {
    next(err);
  }
});

router.post('/', ensureAdmin, async (req, res, next) => {
  try {
    const { name, oral_max, written_max } = req.body;
    if (!name || !oral_max || !written_max) {
      setFlash(req, 'warning', 'Minden mező kitöltése kötelező.');
      return res.redirect('/app117/crud');
    }
    await createSubject({
      name,
      oral_max: Number(oral_max),
      written_max: Number(written_max),
    });
    setFlash(req, 'success', 'Új vizsgatárgy felvéve.');
    res.redirect('/app117/crud');
  } catch (err) {
    next(err);
  }
});

router.post('/:id/update', ensureAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, oral_max, written_max } = req.body;
    const subject = await findSubject(id);
    if (!subject) {
      setFlash(req, 'warning', 'A megadott tantárgy nem létezik.');
      return res.redirect('/app117/crud');
    }
    await updateSubject(id, {
      name,
      oral_max: Number(oral_max),
      written_max: Number(written_max),
    });
    setFlash(req, 'success', 'A tantárgy adatai frissültek.');
    res.redirect('/app117/crud');
  } catch (err) {
    next(err);
  }
});

router.post('/:id/delete', ensureAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deleteSubject(id);
    setFlash(req, 'success', 'A tantárgy törölve.');
    res.redirect('/app117/crud');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
