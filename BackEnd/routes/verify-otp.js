import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'StevDB'
});

// OTP verification endpoint
// OTP verification endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Query the database for the OTP associated with the email
  db.query('SELECT otp, otp_created_at FROM Users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { otp: storedOtp, otp_created_at } = result[0];

    // Check if the OTP has expired
    const now = new Date();
    const otpExpirationTime = new Date(otp_created_at);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5); // Assuming OTP valid for 5 minutes

    if (now > otpExpirationTime) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, update user as verified and clear OTP
    db.query('UPDATE Users SET otp = NULL, otp_created_at = NULL, is_verified = 1 WHERE email = ?', [email], (err) => {
      if (err) {
        console.error('Error updating user as verified:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(200).json({ message: 'OTP verified successfully, user is now verified.' });
    });
  });
});

export default router;
