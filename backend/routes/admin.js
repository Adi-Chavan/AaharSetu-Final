const express = require("express");

const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/ngo", adminController.getAllNGOs);
router.get("/volunteer", adminController.getAllVolunteers);
router.get("/donation", adminController.getAllDonations);
router.get("/pending", adminController.getPendingApprovals);
router.get("/:id", adminController.getNGOById);

router.put("/approve/donor/:id", adminController.approveDonor);
router.put("/approve/ngo/:id", adminController.approveNGO);
router.put("/donation/:id/approve", adminController.approveDonation);
router.put("/donation/:id/reject", adminController.rejectDonation);
router.put("/approve/volunteer/:id", adminController.approveVolunteer);

module.exports = router;
