const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor'], default: 'donor' },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.models.Donor || mongoose.model('Donor', donorSchema);