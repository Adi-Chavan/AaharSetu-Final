const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  assigned_pickups: [
    {
      donor_id: Number,
      ngo_id: Number,
      food_id: Number,
      status: String
    }
  ]
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
