const express = require("express");
const router = express.Router();

const controller = require("../controllers/enrollmentRequestController");

router.get("/", controller.getAllRequests);

router.post("/", controller.createRequest);

router.put("/approve/:id", controller.approveRequest);

router.put("/reject/:id", controller.rejectRequest);

module.exports = router;
