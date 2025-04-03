const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({ ...req.body, user: req.user.id });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createComplaint, getUserComplaints };