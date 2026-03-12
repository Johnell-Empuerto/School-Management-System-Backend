const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const checkAuth = require("../middleware/authMiddleware");

router.get("/", checkAuth, studentController.getStudents);
router.get("/class/:class_id", checkAuth, studentController.getStudentsByClass);
router.post("/", checkAuth, studentController.createStudent);

router.put("/:id", checkAuth, studentController.updateStudent);
router.delete("/:id", checkAuth, studentController.deleteStudent);

module.exports = router;
