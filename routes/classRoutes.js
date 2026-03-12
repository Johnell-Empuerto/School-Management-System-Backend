const express = require("express");
const router = express.Router();

const {
  getClasses,
  createClass,
  deleteClass,
  getClassesBySchoolYear,
} = require("../controllers/classController");

router.get("/classes", getClasses);

router.get("/classes-by-year", getClassesBySchoolYear);

router.post("/classes", createClass);

router.delete("/classes/:id", deleteClass);

module.exports = router;
