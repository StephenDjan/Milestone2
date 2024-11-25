import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const router = express.Router();

// Create a connection pool using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoint for fetching dashboard data
router.get('/dashboard-data', async (req, res) => {
  try {
    const [totalStudents] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role = "student"');
    const [pendingEntries] = await db.query('SELECT COUNT(*) AS total FROM advising_entries WHERE status = "pending"');
    const [totalCourses] = await db.query('SELECT COUNT(*) AS total FROM courses');

    res.json({
      totalStudents: totalStudents[0].total,
      pendingEntries: pendingEntries[0].total,
      totalCourses: totalCourses[0].total,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Endpoint for fetching courses
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT * FROM courses 
      WHERE courseLevel BETWEEN 100 AND 499 
      AND isPrerequisite = true
    `);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Endpoint to update courses
router.post('/update-courses', async (req, res) => {
  const enabledCourses = req.body.courses;

  if (!Array.isArray(enabledCourses) || enabledCourses.length === 0) {
    return res.status(400).send('No courses provided');
  }

  const values = enabledCourses.map(course => [
    course.courseId, 
    course.courseLevel, 
    course.courseCode, 
    course.courseName
  ]);

  try {
    const query = `
      INSERT INTO prereqs (courseId, courseLevel, courseCode, courseName)
      VALUES ?
    `;
    await db.query(query, [values]);
    res.status(200).send('Courses updated successfully');
  } catch (error) {
    console.error('Error inserting/updating courses:', error);
    res.status(500).send('Failed to update courses');
  }
});

// **New Endpoint**: Fetch Pending Advising Entries
router.get('/pending-entries', async (req, res) => {
  try {
    const [entries] = await db.query(`
      SELECT advisingId, userId, lastTerm, lastGPA, currentTerm, status, rejectionReason, studentName, date
      FROM AdvisingRecords
    `);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching pending entries:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending entries.' });
  }
});

export default router;
