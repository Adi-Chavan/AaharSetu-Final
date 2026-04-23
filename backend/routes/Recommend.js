const express = require("express");

const recommendController = require("../controllers/recommendController");

const router = express.Router();

router.post("/recommend", recommendController.getRecommendations);
router.post("/predict", recommendController.getPrediction);

module.exports = router;
