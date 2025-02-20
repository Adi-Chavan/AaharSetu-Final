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


router.get('/', async (req, res) => {
  try {
    console.log("Authenticated User ID:", req.user._id);  // Debug log

    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });

    console.log("Donations found:", donations); // Debug log
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

module.exports = router;
