const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donation = require('../models/Donation');

const { isAuthenticated, hasRole } = require('../middlewares/authMiddleware');

// ✅ 1️⃣ Fetch all pending donation requests for NGOs (Not Yet Approved)
router.get('/requests', isAuthenticated, hasRole(['ngo']), async (req, res) => {
  try {
    console.log("Fetching pending donation requests for NGO:", req.user._id);

    const donationRequests = await Donation.find({ ngoApproved: false }).sort({ createdAt: -1 });

    console.log("Pending Donation Requests:", donationRequests);
    res.json(donationRequests);
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).json({ error: "Failed to fetch donation requests" });
  }
});

// ✅ 2️⃣ Fetch All Donations Approved by the Logged-in NGO
router.get('/approved', isAuthenticated, hasRole(['ngo']), async (req, res) => {
  try {
    console.log("Authenticated NGO ID:", req.user._id);

    const ngoId = new mongoose.Types.ObjectId(req.user._id); // ✅ Ensure ObjectId
    const approvedDonations = await Donation.find({ ngoId, ngoApproved: true });

    console.log("Approved Donations:", approvedDonations);
    res.json(approvedDonations);
  } catch (error) {
    console.error("Error fetching approved donations:", error);
    res.status(500).json({ error: "Failed to fetch approved donations" });
  }
});

// ✅ 3️⃣ Approve a Donation Request
router.post('/requests/:id/accept', isAuthenticated, hasRole(['ngo']), async (req, res) => {
  try {
    const donationId = req.params.id;

    // ✅ Approve the donation and assign the NGO ID
    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { ngoApproved: true, ngoId: req.user._id },
      { new: true }
    );

    if (!updatedDonation) return res.status(404).json({ error: "Donation not found" });

    console.log("Donation Approved:", updatedDonation);
    res.json({ message: "Donation approved", donation: updatedDonation });
  } catch (error) {
    console.error("Error accepting donation request:", error);
    res.status(500).json({ error: "Failed to accept donation request" });
  }
});

module.exports = router;





// const express = require("express");
// const NGO = require("../models/NGO");
// const router = express.Router();

// // Get all NGOs
// router.get("/", async (req, res) => {
//   try {
//     const ngos = await NGO.find();
//     res.json(ngos);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
