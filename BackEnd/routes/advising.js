import express from 'express';
import db from '../controllers/config/db.js'; // Adjust path based on your setup

const router = express.Router();

// Fetch advising history for a student
router.get('/history', (req, res) => {
  const studentId = req.query.studentId; // Assume student ID is passed as a query param

  const query = `SELECT date, term, status FROM AdvisingRecords WHERE student_id = ? ORDER BY date DESC`;
  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(200).json({ records: [], message: 'No Records' });
    }
    res.status(200).json({ records: result });
  });
});

export default router;
