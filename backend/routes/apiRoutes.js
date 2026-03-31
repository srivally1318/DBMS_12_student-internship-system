const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const enrollController = require('../controllers/enrollController');

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Enrollment / Application Routes
router.post('/enroll', enrollController.enroll);
router.get('/enrollments/:userId', enrollController.getEnrollments);

module.exports = router;
