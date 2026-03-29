const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const controller = require("../controllers/enrollmentRequestController");

router.get("/", checkAuth, controller.getAllRequests);

router.post("/", checkAuth, controller.createRequest);

router.put("/approve/:id", checkAuth, controller.approveRequest);

router.put("/reject/:id", checkAuth, controller.rejectRequest);

module.exports = router;
