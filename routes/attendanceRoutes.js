const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const controller = require("../controllers/attendanceController");

router.get(
  "/:class_subject_id/:month/:year",
  checkAuth,
  controller.getAttendance,
);

router.post("/", checkAuth, controller.saveAttendance);

module.exports = router;
