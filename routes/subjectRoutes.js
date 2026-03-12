const express = require("express");
const router = express.Router();

const {
  getSubjects,
  createSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.get("/subjects", getSubjects);

router.post("/subjects", createSubject);

router.delete("/subjects/:id", deleteSubject);

module.exports = router;
