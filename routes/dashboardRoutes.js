const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

/* Dashboard Stats */
router.get("/", dashboardController.getDashboard);

/* Attendance Chart (Admin/Teacher) */
router.get("/attendance-chart", dashboardController.getAttendanceChart);

/* Student Attendance */
router.get(
  "/student-attendance",
  dashboardController.getStudentAttendanceChart,
);

module.exports = router;
