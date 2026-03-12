const calendarModel = require("../models/calendarModel");

async function getEvents(req, res) {
  try {
    const data = await calendarModel.getCalendarEvents();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createEvent(req, res) {
  try {
    const user = req.session.user;

    const data = {
      ...req.body,
      created_by: user.id,
    };

    await calendarModel.createCalendarEvent(data);

    res.json({ message: "Event added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteEvent(req, res) {
  try {
    await calendarModel.deleteCalendarEvent(req.params.id);
    res.json({ message: "Event removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateEvent(req, res) {
  try {
    await calendarModel.updateCalendarEvent(req.params.id, req.body);

    res.json({ message: "Event updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
};
