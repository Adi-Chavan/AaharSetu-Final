const Volunteer = require("../models/Volunteer");
const Donation = require("../models/Donation");

// Register new volunteer
exports.registerVolunteer = async (req, res) => {
    try {
        const { name, email, phone, address, emergencyContact, city, pincode, state, lat, lng } = req.body;

        // Check if user is already registered as volunteer
        const existingVolunteer = await Volunteer.findOne({ user: req.user._id });
        if (existingVolunteer) {
            return res.status(400).json({ message: "You are already registered as a volunteer" });
        }

        // Create new volunteer
        const volunteer = new Volunteer({
            user: req.user._id,
            name: name || req.user.name,
            email: email || req.user.email,
            phone,
            address,
            emergencyContact,
            city,
            pincode,
            state,
            coordinates: {
                lat: lat || 0,
                lng: lng || 0
            }
        });

        await volunteer.save();

        // Update user role to include 'volunteer'
        if (!req.user.role.includes("volunteer")) {
            req.user.role.push("volunteer");
            await req.user.save();
        }

        res.status(201).json({ message: "Volunteer registration successful!", volunteer });
    } catch (error) {
        console.error("Error registering volunteer:", error);
        res.status(500).json({ message: "Server error during volunteer registration" });
    }
};

// Get approved donations
exports.getApprovedDonations = async (req, res) => {
    try {
        const approvedDonations = await Donation.find({
            status: "approved",
            claimedBy: null
        }).populate("donor", "name email").sort({ createdAt: -1 });

        res.json(approvedDonations);
    } catch (error) {
        console.error("Error fetching approved donations:", error);
        res.status(500).json({ error: "Failed to fetch approved donations" });
    }
};

// Claim a donation
exports.claimDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const volunteerId = req.user._id; // Get logged-in volunteer ID

        const donation = await Donation.findById(donationId);
        if (!donation) return res.status(404).json({ error: "Donation not found" });

        // ✅ Update donation as claimed
        donation.claimedBy = volunteerId;
        donation.status = "claimed";
        await donation.save();

        res.json({ message: "Donation claimed successfully", donation });
    } catch (error) {
        console.error("Error claiming donation:", error);
        res.status(500).json({ error: "Failed to claim donation" });
    }
};

// Get active deliveries for a volunteer
exports.getActiveDeliveries = async (req, res) => {
    try {
        console.log("Fetching active deliveries for volunteer:", req.user._id);

        const activeDeliveries = await Donation.find({
            claimedBy: req.user._id, // Only fetch deliveries claimed by this volunteer
            status: "claimed",
        }).sort({ claimedAt: -1 });

        console.log("Active Deliveries Found:", activeDeliveries);
        res.json(activeDeliveries);
    } catch (error) {
        console.error("Error fetching active deliveries:", error);
        res.status(500).json({ error: "Failed to fetch active deliveries" });
    }
};

// Complete a delivery
exports.completeDelivery = async (req, res) => {
    try {
        const { donationId } = req.params;
        const volunteerId = req.user._id; // Get the logged-in volunteer's ID

        const donation = await Donation.findById(donationId);
        if (!donation) return res.status(404).json({ message: "Donation not found" });

        if (donation.claimedBy.toString() !== volunteerId.toString()) {
            return res.status(403).json({ message: "You are not assigned to this donation" });
        }

        if (donation.status === "completed") {
            return res.status(400).json({ message: "This delivery has already been completed" });
        }

        donation.status = "completed"; // Mark as completed
        await donation.save();

        res.json({ message: "Delivery completed successfully", donation });
    } catch (error) {
        console.error("Error completing delivery:", error);
        res.status(500).json({ error: "Failed to complete delivery" });
    }
};