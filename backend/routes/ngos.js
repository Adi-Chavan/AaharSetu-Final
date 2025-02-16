const express = require("express");
const NGO = require("../models/NGO");

const router = express.Router();

// POST route to register NGO
router.post("/register", async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.status(201).json({ message: "NGO registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register NGO" });
  }
});

module.exports = router;





// const express = require("express");
// const NGO = require("../models/NGO");
// const router = express.Router();

// // Get all NGOs
// router.get("/", async (req, res) => {
//   try {
//     const ngos = await NGO.find();
//     res.json(ngos);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
