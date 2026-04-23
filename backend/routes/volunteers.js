const express = require("express");

const router = express.Router();

const { isAuthenticated, hasRole } = require("../middlewares/authMiddleware");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");

// Register as volunteer
router.post("/register", isAuthenticated, async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.status(201).json({ message: "Volunteer registered successfully", volunteer: newVolunteer });
  } catch (error) {
    console.error("Error saving volunteer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get approved donations
router.get("/approved-donations", isAuthenticated, hasRole(["volunteer"]), async (req, res) => {
  try {
    const volunteerId = req.user._id;

    const availableDonations = await Donation.find({ ngoApproved: true, claimedBy: null }).sort({ createdAt: -1 });
    const activeDeliveries = await Donation.find({ claimedBy: volunteerId, status: "claimed" }).sort({ createdAt: -1 });

    res.json({ availableDonations, activeDeliveries });
  } catch (error) {
    console.error("Error fetching approved donations:", error);
    res.status(500).json({ error: "Failed to fetch approved donations" });
  }
});

// Claim a donation
router.post("/claim/:donationId", isAuthenticated, hasRole(["volunteer"]), async (req, res) => {
  try {
    const { donationId } = req.params;
    const volunteerId = req.user._id;

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ error: "Donation not found" });

    donation.claimedBy = volunteerId;
    donation.status = "claimed";
    donation.claimedAt = new Date();
    await donation.save();

    res.json({ message: "Donation claimed successfully", donation });
  } catch (error) {
    console.error("Error claiming donation:", error);
    res.status(500).json({ error: "Failed to claim donation" });
  }
});

// Get active deliveries
router.get("/active-deliveries", isAuthenticated, hasRole(["volunteer"]), async (req, res) => {
  try {
    const activeDeliveries = await Donation.find({
      claimedBy: req.user._id,
      status: "claimed",
    }).sort({ claimedAt: -1 });

    res.json(activeDeliveries);
  } catch (error) {
    console.error("Error fetching active deliveries:", error);
    res.status(500).json({ error: "Failed to fetch active deliveries" });
  }
});

// Complete delivery
router.post("/complete/:donationId", isAuthenticated, hasRole(["volunteer"]), async (req, res) => {
  try {
    const { donationId } = req.params;
    const volunteerId = req.user._id;

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    if (!donation.claimedBy || donation.claimedBy.toString() !== volunteerId.toString()) {
      return res.status(403).json({ message: "You are not assigned to this donation" });
    }

    if (donation.status === "completed") {
      return res.status(400).json({ message: "This delivery has already been completed" });
    }

    donation.status = "completed";
    await donation.save();

    res.json({ message: "Delivery completed successfully", donation });
  } catch (error) {
    console.error("Error completing delivery:", error);
    res.status(500).json({ error: "Failed to complete delivery" });
  }
});

module.exports = router;

