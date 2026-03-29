const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const classSubjectController = require("../controllers/classSubjectController");

router.get("/", checkAuth, classSubjectController.getAllClassSubjects);
router.post("/", checkAuth, classSubjectController.createClassSubject);
router.delete("/:id", checkAuth, classSubjectController.deleteClassSubject);
router.put("/:id", checkAuth, classSubjectController.updateClassSubject);
router.get(
  "/teacher",
  checkAuth,
  classSubjectController.getTeacherClassSubjects,
);

module.exports = router;
