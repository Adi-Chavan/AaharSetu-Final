const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

const { isAuthenticated, hasRole } = require('../middlewares/authMiddleware');

// Route to handle donation form submission
router.post('/add', isAuthenticated, hasRole(['donor']), async (req, res) => {
  try {
    const donation = new Donation({ ...req.body, donorId: req.user._id }); // ✅ Associate donation with donor
    await donation.save();
    res.status(201).json({ message: 'Donation saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation' });
  }
});


module.exports = router;
