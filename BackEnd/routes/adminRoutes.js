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

// New endpoint for fetching courses
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await db.query(`SELECT * FROM courses 
        WHERE courseLevel BETWEEN 100 AND 499 
        AND isPrerequisite = true;`
        );
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

router.post('/update-courses', (req, res) => {
    const enabledCourses = req.body.courses;
    
    // Check if the enabledCourses array is valid
    if (!Array.isArray(enabledCourses) || enabledCourses.length === 0) {
      return res.status(400).send('No courses provided');
    }
  
    // Prepare the query for bulk insert
    const values = enabledCourses.map(course => [
      course.courseId, 
      course.courseLevel, 
      course.courseCode, 
      course.courseName
    ]);
  
    // Bulk insert query
    const query = `
      INSERT INTO prereqs (courseId, courseLevel, courseCode, courseName)
      VALUES ?`;
  
    // Execute the query to insert the enabled courses
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Error inserting/updating courses:', err);
        return res.status(500).send('Failed to update courses');
      }
      res.status(200).send('Courses updated successfully');
    });
  });
  
  
export default router;
