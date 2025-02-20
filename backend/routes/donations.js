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

//Route to fetch all donations made by the logged-in donor
const mongoose = require('mongoose');

router.get("/", isAuthenticated, hasRole(["donor"]), async (req, res) => {
  try {
    console.log("Authenticated User ID:", req.user._id);

    const donorId = new mongoose.Types.ObjectId(req.user._id); // Ensure ObjectId
    const donations = await Donation.find({ donorId });

    // ✅ Add a correct status field
    const formattedDonations = donations.map((donation) => ({
      ...donation._doc,
      status: donation.ngoApproved
        ? donation.claimedBy
          ? donation.deliveredAt
            ? "completed"
            : "claimed"
          : "ngo_approved"
        : "pending",
    }));

    console.log("Formatted Donations with Status:", formattedDonations); // ✅ Debugging

    res.json(formattedDonations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});


// router.get('/', isAuthenticated, hasRole(['donor']), async (req, res) => {
//   try {
//     console.log("Authenticated User ID:", req.user._id);

//     const donorId = new mongoose.Types.ObjectId(req.user._id); // ✅ Ensure ObjectId
//     const donations = await Donation.find({ donorId });

//     console.log("Donations found:", donations);
//     res.json(donations);
//   } catch (error) {
//     console.error("Error fetching donations:", error);
//     res.status(500).json({ error: "Failed to fetch donations" });
//   }
// });


// const mongoose = require('mongoose');

// router.get('/', isAuthenticated, hasRole(['donor']), async (req, res) => {
//   try {
//     console.log("Authenticated User ID:", req.user._id, "Type:", typeof req.user._id);

//     // Ensure donorId is a valid ObjectId
//     let donorId;
//     if (mongoose.isValidObjectId(req.user._id)) {
//     donorId = new mongoose.Types.ObjectId(_id);
//     } else {
//       donorId = req.user._id;  // Use it as it is if already an ObjectId
//     }

//     console.log("Querying for donorId:", donorId);

//     const donations = await Donation.find({ donorId });

//     console.log("Donations found:", donations);

//     res.json(donations);
//   } catch (error) {
//     console.error('Error fetching donations:', error);
//     res.status(500).json({ error: 'Failed to fetch donations' });
//   }
// });


module.exports = router;
