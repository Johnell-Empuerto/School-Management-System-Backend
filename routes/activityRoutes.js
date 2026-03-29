const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const activityController = require("../controllers/activityController");

router.get("/", checkAuth, activityController.getActivities);
router.post("/", checkAuth, activityController.createActivity);
router.put("/:id", checkAuth, activityController.updateActivity);
router.delete("/:id", checkAuth, activityController.deleteActivity);

module.exports = router;
