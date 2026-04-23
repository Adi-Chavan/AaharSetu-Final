const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const DonationRequest = require('../models/requestDonation');

// Add a new donation
const addDonation = async (req, res) => {
  try {
    const donation = new Donation({ ...req.body, donorId: req.user._id });
    await donation.save();
    res.status(201).json({ message: 'Donation saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation' });
  }
};

// Get all donations made by the logged-in donor
const getDonorDonations = async (req, res) => {
  try {
    console.log('Authenticated User ID:', req.user._id);

    const donorId = new mongoose.Types.ObjectId(req.user._id);
    const donations = await Donation.find({ donorId });

    // Add a correct status field
    const formattedDonations = donations.map((donation) => ({
      ...donation._doc,
      status: donation.ngoApproved
        ? donation.claimedBy
          ? donation.deliveredAt
            ? 'completed'
            : 'claimed'
          : 'ngo_approved'
        : 'pending',
    }));

    console.log('Formatted Donations with Status:', formattedDonations);
    res.json(formattedDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// Create a donation request
const requestDonation = async (req, res) => {
  try {
    const { title, description, quantity, requiredBy, dietaryRequirements } = req.body;

    if (!title || !description || !quantity || !requiredBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRequest = new DonationRequest({
      title,
      description,
      quantity,
      dietaryRequirements,
      requiredBy: new Date(requiredBy),
      requestedBy: req.user._id,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating donation request:', error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

// Get all requested donations by NGOs
const getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching NGO requests:', error);
    res.status(500).json({ error: 'Failed to fetch NGO requests' });
  }
};

// Accept a donation request
const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await DonationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const newDonation = new Donation({
      title: request.title,
      description: request.description,
      quantity: request.quantity,
      pickupTime: request.requiredBy,
      donorId: req.user._id,
      ngoId: request.ngoId,
      status: 'pending',
    });

    await newDonation.save();
    await DonationRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      message: 'Request accepted and converted into a donation',
      donation: newDonation
    });
  } catch (error) {
    console.error('Error accepting NGO request:', error);
    res.status(500).json({ error: 'Failed to accept donation request' });
  }
};

module.exports = {
  addDonation,
  getDonorDonations,
  requestDonation,
  getMyRequests,
  acceptRequest
};