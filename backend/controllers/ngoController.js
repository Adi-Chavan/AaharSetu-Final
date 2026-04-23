const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const DonationRequest = require('../models/requestDonation');
const NGO = require('../models/NGO');

// Register a new NGO
const registerNGO = async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.status(201).json({ message: 'NGO registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register NGO' });
  }
};

// Fetch all pending donation requests for NGOs (Not Yet Approved)
const getDonationRequests = async (req, res) => {
  try {
    console.log('Fetching pending donation requests for NGO:', req.user._id);

    const donationRequests = await Donation.find({ ngoApproved: false }).sort({ createdAt: -1 });

    console.log('Pending Donation Requests:', donationRequests);
    res.json(donationRequests);
  } catch (error) {
    console.error('Error fetching donation requests:', error);
    res.status(500).json({ error: 'Failed to fetch donation requests' });
  }
};

// Fetch All Donations Approved by the Logged-in NGO
const getApprovedDonations = async (req, res) => {
  try {
    console.log('Authenticated NGO ID:', req.user._id);

    const ngoId = new mongoose.Types.ObjectId(req.user._id);
    const approvedDonations = await Donation.find({ ngoId, ngoApproved: true });

    console.log('Approved Donations:', approvedDonations);
    res.json(approvedDonations);
  } catch (error) {
    console.error('Error fetching approved donations:', error);
    res.status(500).json({ error: 'Failed to fetch approved donations' });
  }
};

// Approve a Donation Request
const acceptDonationRequest = async (req, res) => {
  try {
    const donationId = req.params.id;

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { ngoApproved: true, ngoId: req.user._id },
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    console.log('Donation Approved:', updatedDonation);
    res.json({ message: 'Donation approved', donation: updatedDonation });
  } catch (error) {
    console.error('Error accepting donation request:', error);
    res.status(500).json({ error: 'Failed to accept donation request' });
  }
};

// Create a donation request by NGO
const requestDonation = async (req, res) => {
  try {
    const { title, description, quantity, requiredBy } = req.body;

    if (!title || !description || !quantity || !requiredBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRequest = new DonationRequest({
      title,
      description,
      quantity,
      requiredBy: new Date(requiredBy),
      ngoId: req.user._id,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating donation request:', error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

// Get all requested donations by the logged-in NGO
const getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find({ ngoId: req.user._id });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching NGO requests:', error);
    res.status(500).json({ error: 'Failed to fetch NGO requests' });
  }
};

module.exports = {
  registerNGO,
  getDonationRequests,
  getApprovedDonations,
  acceptDonationRequest,
  requestDonation,
  getMyRequests
};