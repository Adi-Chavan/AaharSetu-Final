const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { isAuthenticated, hasRole } = require('../middlewares/authMiddleware');

// Register a new NGO
router.post('/register', isAuthenticated, hasRole(['ngo']), ngoController.registerNGO);

// Fetch all pending donation requests for NGOs (Not Yet Approved)
router.get('/requests', isAuthenticated, hasRole(['ngo']), ngoController.getDonationRequests);

// Fetch All Donations Approved by the Logged-in NGO
router.get('/approved', isAuthenticated, hasRole(['ngo']), ngoController.getApprovedDonations);

// Approve a Donation Request
router.post('/requests/:id/accept', isAuthenticated, hasRole(['ngo']), ngoController.acceptDonationRequest);

// Create a donation request by NGO
router.post('/request-donation', isAuthenticated, ngoController.requestDonation);

// Get all requested donations by the logged-in NGO
router.get('/my-requests', isAuthenticated, hasRole(['ngo']), ngoController.getMyRequests);

module.exports = router;