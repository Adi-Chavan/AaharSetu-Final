const axios = require("axios");

// Get NGO recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const { latitude, longitude, foodType, quantity } = req.body;

        if (!latitude || !longitude || !foodType || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("🔹 Sending request to Flask API...");

        const response = await axios.post(
            "http://localhost:5001/recommend",  //flask server
            { latitude, longitude, foodType, quantity },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ Flask Response:", response.data);
        res.json(response.data);

    } catch (error) {
        console.error("Error fetching recommendations:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
};

// ML prediction
exports.getPrediction = async (req, res) => {
    try {
        const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", req.body);
        res.json(flaskResponse.data); // Send response to frontend
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};