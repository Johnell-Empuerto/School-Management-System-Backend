const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const {
  getClasses,
  createClass,
  deleteClass,
  getClassesBySchoolYear,
} = require("../controllers/classController");

router.get("/classes", checkAuth, getClasses);

router.get("/classes-by-year", checkAuth, getClassesBySchoolYear);

router.post("/classes", checkAuth, createClass);

router.delete("/classes/:id", checkAuth, deleteClass);

module.exports = router;
