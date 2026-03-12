const express = require("express");
const router = express.Router();

const {
  getSchoolYears,
  getSchoolYearsFull,
  createYear,
  updateYear,
  deleteYear,
  activateYear,
  getActiveYear,
} = require("../controllers/schoolYearController");

router.get("/school-years", getSchoolYears);
router.get("/school-years-full", getSchoolYearsFull);

router.post("/school-years", createYear);

router.put("/school-years/:id", updateYear);

router.delete("/school-years/:id", deleteYear);

router.put("/school-years/:id/activate", activateYear);

router.get("/school-years-active", getActiveYear);

module.exports = router;
