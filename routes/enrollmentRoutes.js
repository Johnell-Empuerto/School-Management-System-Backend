const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");

router.get("/", enrollmentController.getAllEnrollments);

router.post("/", enrollmentController.createEnrollment);

router.delete("/:id", enrollmentController.deleteEnrollment);

router.put("/drop/:id", enrollmentController.dropEnrollment);

router.put("/restore/:id", enrollmentController.restoreEnrollment);

module.exports = router;
