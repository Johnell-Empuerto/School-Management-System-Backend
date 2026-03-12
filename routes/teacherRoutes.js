const express = require("express");
const router = express.Router();

const {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateStatus,
  updateTeacher,
} = require("../controllers/teacherController");

router.get("/teachers", getTeachers);

router.post("/teachers", createTeacher);

router.delete("/teachers/:id", deleteTeacher);

router.put("/teachers/:id/status", updateStatus);

router.put("/teachers/:id", updateTeacher);

module.exports = router;
