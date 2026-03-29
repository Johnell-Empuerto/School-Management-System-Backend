const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const calendarController = require("../controllers/calendarController");

router.get("/", checkAuth, calendarController.getEvents);
router.post("/", checkAuth, calendarController.createEvent);
router.delete("/:id", checkAuth, calendarController.deleteEvent);
router.put("/:id", checkAuth, calendarController.updateEvent);

module.exports = router;
