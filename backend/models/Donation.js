const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: String,
  description: String,
  quantity: Number,
  expiryDate: String,
  pickupAddress: String,
  pickupTime: String,
  photo: String, // Store as base64 or a file reference
  donorName: String,
  donorPhone: String,
  latitude: Number,
  longitude: Number,
  foodType: String,
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
