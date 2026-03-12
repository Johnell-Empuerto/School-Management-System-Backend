const express = require("express");
const router = express.Router();

const classSubjectController = require("../controllers/classSubjectController");

router.get("/", classSubjectController.getAllClassSubjects);
router.post("/", classSubjectController.createClassSubject);
router.delete("/:id", classSubjectController.deleteClassSubject);
router.put("/:id", classSubjectController.updateClassSubject);
router.get("/teacher", classSubjectController.getTeacherClassSubjects);

module.exports = router;
