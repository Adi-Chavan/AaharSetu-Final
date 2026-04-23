const Donor = require("../models/Donor");
const Donation = require('../models/Donation');

// Get all donors
exports.getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new donor
exports.addDonor = async (req, res) => {
    const newDonor = new Donor(req.body);
    try {
        const savedDonor = await newDonor.save();
        res.status(201).json(savedDonor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};