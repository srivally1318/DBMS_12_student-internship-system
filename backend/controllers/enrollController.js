// controllers/enrollController.js
const dbPromise = require('../db/connection');

exports.enroll = async (req, res) => {
    try {
        const db = await dbPromise; // Wait until connection is ready
        const { userId, courseName, phone } = req.body;

        if (!userId || !courseName || !phone) {
            return res.status(400).json({ success: false, message: 'Missing required application details.' });
        }

        // 🛑 Prevent duplicate enrollments for the same user and course
        const [existing] = await db.query(
            'SELECT * FROM enrollments WHERE user_id = ? AND course_name = ?',
            [userId, courseName]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // ✅ Save valid enrollment logically
        const [result] = await db.query(
            'INSERT INTO enrollments (user_id, course_name, phone) VALUES (?, ?, ?)',
            [userId, courseName, phone]
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully!',
            enrollmentId: result.insertId
        });
    } catch (error) {
        console.error('Enroll Error:', error);
        res.status(500).json({ success: false, message: 'Server error during application submission.' });
    }
};

exports.getEnrollments = async (req, res) => {
    try {
        const db = await dbPromise; // Wait until connection is ready
        const { userId } = req.params;

        const [enrollments] = await db.query(
            `SELECT id, course_name AS courseName, phone, date
             FROM enrollments
             WHERE user_id = ?
             ORDER BY date DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            enrollments
        });
    } catch (error) {
        console.error('Fetch Enrollments Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching applications.' });
    }
};