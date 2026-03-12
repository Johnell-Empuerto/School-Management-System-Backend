const express = require("express");
const router = express.Router();

const controller = require("../controllers/attendanceController");

router.get("/:class_subject_id/:month/:year", controller.getAttendance);

router.post("/", controller.saveAttendance);

module.exports = router;
