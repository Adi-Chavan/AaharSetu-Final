const Donation = require('../models/Donation');
const DonationRequest = require('../models/requestDonation');
const NGO = require('../models/NGO');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');

// Fetch all NGOs
exports.getAllNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find();
        res.status(200).json(ngos);
    } catch (error) {
        res.status(500).json({ error: "Error fetching NGOs", details: error.message });
    }
};

// Fetch all volunteers
exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching volunteers", details: error.message });
    }
};

// Fetch all donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching donations", details: error.message });
    }
};

// Fetch a specific NGO by ID
exports.getNGOById = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.status(200).json(ngo);
    } catch (error) {
        res.status(500).json({ error: "Error fetching NGO", details: error.message });
    }
};

// Fetch all pending approvals
exports.getPendingApprovals = async (req, res) => {
    try {
        const pendingDonors = await Donor.find({ isApproved: false });
        const pendingNGOs = await NGO.find({ isApproved: false });
        const pendingVolunteers = await Volunteer.find({ isApproved: false });

        res.json({
            donors: pendingDonors,
            ngos: pendingNGOs,
            volunteers: pendingVolunteers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Approve a donor
exports.approveDonor = async (req, res) => {
    try {
        const donor = await Donor.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!donor) return res.status(404).json({ message: 'Donor not found' });

        res.json({ message: 'Donor approved successfully', donor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Approve an NGO
exports.approveNGO = async (req, res) => {
    try {
        const ngo = await NGO.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!ngo) return res.status(404).json({ message: 'NGO not found' });

        res.json({ message: 'NGO approved successfully', ngo });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Approve a donation
exports.approveDonation = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );
        
        if (!updatedDonation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({ message: "Donation approved", updatedDonation });
    } catch (error) {
        res.status(500).json({ error: "Error updating donation", details: error.message });
    }
};

// Reject a donation
exports.rejectDonation = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        );

        if (!updatedDonation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({ message: "Donation rejected", updatedDonation });
    } catch (error) {
        res.status(500).json({ error: "Error updating donation", details: error.message });
    }
};

// Approve a volunteer
exports.approveVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        res.json({ message: 'Volunteer approved successfully', volunteer });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};