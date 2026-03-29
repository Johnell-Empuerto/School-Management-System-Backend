const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const {
  getSchoolYears,
  getSchoolYearsFull,
  createYear,
  updateYear,
  deleteYear,
  activateYear,
  getActiveYear,
} = require("../controllers/schoolYearController");

router.get("/school-years", checkAuth, getSchoolYears);
router.get("/school-years-full", checkAuth, getSchoolYearsFull);

router.post("/school-years", checkAuth, createYear);

router.put("/school-years/:id", checkAuth, updateYear);

router.delete("/school-years/:id", checkAuth, deleteYear);

router.put("/school-years/:id/activate", checkAuth, activateYear);

router.get("/school-years-active", checkAuth, getActiveYear);

module.exports = router;
