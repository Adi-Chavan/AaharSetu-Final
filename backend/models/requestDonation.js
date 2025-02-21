const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  requiredBy: { type: Date, required: true },
  dietaryRequirements: [{type: String}],
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);
module.exports = DonationRequest;



// const mongoose = require("mongoose");

// const donationRequestSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   requiredBy: { type: Date, required: true },
//   dietaryRequirements: { type: [String], default: [] },
//   requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   status: { type: String, enum: ["pending", "accepted"], default: "pending" },
// }, { timestamps: true });

// module.exports = mongoose.model("DonationRequest", donationRequestSchema);
