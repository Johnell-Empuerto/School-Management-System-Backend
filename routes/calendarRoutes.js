const express = require("express");
const router = express.Router();

const calendarController = require("../controllers/calendarController");

router.get("/", calendarController.getEvents);
router.post("/", calendarController.createEvent);
router.delete("/:id", calendarController.deleteEvent);
router.put("/:id", calendarController.updateEvent);

module.exports = router;
