const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateStatus,
  updateTeacher,
} = require("../controllers/teacherController");

router.get("/teachers", checkAuth, getTeachers);

router.post("/teachers", checkAuth, createTeacher);

router.delete("/teachers/:id", checkAuth, deleteTeacher);

router.put("/teachers/:id/status", checkAuth, updateStatus);

router.put("/teachers/:id", checkAuth, updateTeacher);

module.exports = router;
