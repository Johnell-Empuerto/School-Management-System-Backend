const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const {
  getSubjects,
  createSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.get("/subjects", checkAuth, getSubjects);

router.post("/subjects", checkAuth, createSubject);

router.delete("/subjects/:id", checkAuth, deleteSubject);

module.exports = router;
