const express = require("express");
const Volunteer = require("../models/Volunteer");
const router = express.Router();

// Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
