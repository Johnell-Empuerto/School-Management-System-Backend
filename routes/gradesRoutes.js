const express = require("express");
const router = express.Router();

const gradesController = require("../controllers/gradesController");

const checkAuth = require("../middleware/authMiddleware");

router.get(
  "/:class_subject_id/:grading_period/:school_year_id",
  checkAuth,
  gradesController.getGrades,
);

router.post("/", checkAuth, gradesController.saveGrade);

module.exports = router;
