const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/* Dashboard Stats */
router.get("/", checkAuth, dashboardController.getDashboard);

/* Attendance Chart (Admin/Teacher) */
router.get(
  "/attendance-chart",
  checkAuth,
  dashboardController.getAttendanceChart,
);

/* Student Attendance */
router.get(
  "/student-attendance",
  checkAuth,
  dashboardController.getStudentAttendanceChart,
);

module.exports = router;
