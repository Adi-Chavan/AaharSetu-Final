const express = require("express");
const axios = require("axios");
const router = express.Router();

router.use(express.json()); // Ensure JSON parsing

router.post("/recommend", async (req, res) => {
    try {
        const { latitude, longitude, foodType, quantity } = req.body;

        if (!latitude || !longitude || !foodType || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("🔹 Sending request to Flask API...");

        const response = await axios.post(
            "http://localhost:5001/recommend",  // Ensure Flask is running here
            { latitude, longitude, foodType, quantity },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ Flask Response:", response.data);
        res.json(response.data);

    } catch (error) {
        console.error("Error fetching recommendations:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});

module.exports = router;
