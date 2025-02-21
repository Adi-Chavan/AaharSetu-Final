const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  availability: { type: String, required: true },
  volunteeringTypes: { type: [String], required: true },
  hasVehicle: { type: Boolean, required: true },
  foodPreference: { type: String, required: true },
  idProof: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true }
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', VolunteerSchema);
module.exports = Volunteer;



// const mongoose = require("mongoose");

// const volunteerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   location: String,
//   assigned_pickups: [
//     {
//       donor_id: Number,
//       ngo_id: Number,
//       food_id: Number,
//       status: String
//     }
//   ]
// });

// module.exports = mongoose.model("Volunteer", volunteerSchema);
