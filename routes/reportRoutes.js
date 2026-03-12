const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.get("/student/:student_id", reportController.studentReport);

router.get("/class/:class_id", reportController.classReport);

router.get("/attendance/:class_id", reportController.attendanceReport);

router.get("/students-enrolled", reportController.enrolledStudents);

module.exports = router;
