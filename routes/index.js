const express = require('express');
const router = express.Router();
const { topStudents, topSubjects, getExamRows } = require('../models/examModel');

router.get('/', async (req, res, next) => {
  try {
    const [students, subjects, sampleRows] = await Promise.all([
      topStudents(5),
      topSubjects(4),
      getExamRows({ limit: 6 }),
    ]);
    res.render('index', {
      title: 'Érettségi felkészítő portál',
      students: students.map((s) => ({
        ...s,
        avg_total: Number(s.avg_total),
      })),
      subjects: subjects.map((s) => ({
        ...s,
        avg_total: Number(s.avg_total),
      })),
      sampleRows: sampleRows.map((r) => ({
        ...r,
        total_score: Number(r.total_score),
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
