const express = require("express");
const router = express.Router();

const gradesController = require("../controllers/gradesController");

router.get("/:class_subject_id/:grading_period", gradesController.getGrades);

router.post("/", gradesController.saveGrade);

module.exports = router;
