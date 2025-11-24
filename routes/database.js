const express = require('express');
const router = express.Router();
const { getExamRows, getSubjects } = require('../models/examModel');

router.get('/', async (req, res, next) => {
  try {
    const subjectId = req.query.subject ? Number(req.query.subject) : null;
    const [subjects, rows] = await Promise.all([
      getSubjects(),
      getExamRows({ limit: 80, subjectId: subjectId || null }),
    ]);
    res.render('database', {
      title: 'Adatbázis',
      subjects,
      rows,
      activeSubject: subjectId,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
