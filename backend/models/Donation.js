const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  donorName: {
    type: String,
    required: true
  },
  donorPhone: {
    type: String,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  foodType: {
    type: String,
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngoApproved: {
    type: Boolean,
    default: false
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'ngoApproved', 'claimed', 'completed', 'rejected', 'approved'],
    default: 'pending'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;

