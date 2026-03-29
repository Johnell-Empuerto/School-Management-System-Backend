const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const reportController = require("../controllers/reportController");

router.get("/student/:student_id", checkAuth, reportController.studentReport);

router.get("/class/:class_id", checkAuth, reportController.classReport);

router.get(
  "/attendance/:class_id",
  checkAuth,
  reportController.attendanceReport,
);

router.get("/students-enrolled", checkAuth, reportController.enrolledStudents);
router.get(
  "/students-by-class-year",
  checkAuth,
  reportController.studentsByClassYear,
);

module.exports = router;
