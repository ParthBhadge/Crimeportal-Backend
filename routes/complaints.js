const express = require('express');
const { createComplaint, getUserComplaints } = require('../controllers/complaintController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/', auth, createComplaint); // Create a new complaint
router.get('/', auth, getUserComplaints); // Get complaints for the logged-in user

module.exports = router;