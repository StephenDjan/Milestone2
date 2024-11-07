import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Create a database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
  console.log('Connected to the MySQL database.');
});

// Endpoint to create advising entry
router.post('/entry', (req, res) => {
  const { lastTerm, lastGPA, currentTerm, prerequisites, coursePlan } = req.body;

  // Validate data
  if (!lastTerm || !lastGPA || !currentTerm) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  // Insert entry into the AdvisingRecords table
  const advisingEntryQuery = `
    INSERT INTO AdvisingRecords (lastTerm, lastGPA, currentTerm) 
    VALUES (?, ?, ?)
  `;
  db.query(advisingEntryQuery, [lastTerm, lastGPA, currentTerm], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    // Insert prerequisites and course plans if needed
    const advisingId = result.insertId;

    if (prerequisites && prerequisites.length > 0) {
      const prerequisitesQuery = `
        INSERT INTO Prerequisites (advisingId, course) VALUES (?, ?)
      `;
      prerequisites.forEach((pre) => {
        db.query(prerequisitesQuery, [advisingId, pre.course]);
      });
    }

    if (coursePlan && coursePlan.length > 0) {
      const coursePlanQuery = `
        INSERT INTO CoursePlans (advisingId, course) VALUES (?, ?)
      `;
      coursePlan.forEach((course) => {
        db.query(coursePlanQuery, [advisingId, course.course]);
      });
    }

    res.status(201).json({ success: true, message: 'Advising entry created successfully.' });
  });
});

// Endpoint to fetch advising history for a student
router.get('/advising-history', (req, res) => {
  const { email } = req.query;

  const query = `
    SELECT term, course, status
    FROM AdvisingRecords
    WHERE studentEmail = ?
    ORDER BY term DESC
  `;
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching history' });
    }
    res.status(200).json({ records: results });
  });
});

// Endpoint to fetch all courses
router.get('/courses', (req, res) => {
  const query = 'SELECT courseId, courseName, courseCode, courseLevel, isPrerequisite FROM Courses';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching courses' });
    }
    res.status(200).json(results); // Send the results as a JSON response
  });
});

// Endpoint to fetch all courses
router.get('/courses', (req, res) => {
  const query = 'SELECT courseId, courseName, courseCode FROM Courses';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error fetching courses' });
    }
    res.status(200).json(results);
  });
});

export default router;
