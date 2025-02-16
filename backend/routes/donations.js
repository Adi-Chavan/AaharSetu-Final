const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Route to handle donation form submission
router.post('/add', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: 'Donation saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation' });
  }
});

module.exports = router;
