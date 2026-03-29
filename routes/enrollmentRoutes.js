const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const enrollmentController = require("../controllers/enrollmentController");

router.get("/", checkAuth, enrollmentController.getAllEnrollments);

router.post("/", checkAuth, enrollmentController.createEnrollment);

router.delete("/:id", checkAuth, enrollmentController.deleteEnrollment);

router.put("/drop/:id", checkAuth, enrollmentController.dropEnrollment);

router.put("/restore/:id", checkAuth, enrollmentController.restoreEnrollment);

module.exports = router;
