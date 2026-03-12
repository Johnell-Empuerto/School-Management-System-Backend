const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const checkAuth = require("../middleware/authMiddleware");

router.get("/", checkAuth, profileController.getProfile);
router.get("/grades", checkAuth, profileController.getStudentGrades);
router.get("/attendance", checkAuth, profileController.getStudentAttendance);
router.put("/", checkAuth, profileController.updateProfile);

module.exports = router;
