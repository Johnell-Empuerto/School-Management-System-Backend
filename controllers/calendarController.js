const calendarModel = require("../models/calendarModel");
const logAction = require("../utils/auditLogger");

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

    const result = await calendarModel.createCalendarEvent(data);

    // LOG CREATE EVENT
    await logAction({
      user_id: req.session.user.id,
      action: "CREATE_CALENDAR_EVENT",
      table_name: "school_calendar",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        date: data.date,
        type: data.type,
        description: data.description,
        created_by: data.created_by,
      }),
    });

    res.json({ message: "Event added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteEvent(req, res) {
  try {
    const id = req.params.id;

    // Get event details before deletion for logging
    const [event] = await calendarModel.getCalendarEventById(id);

    await calendarModel.deleteCalendarEvent(id);

    // LOG DELETE EVENT
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_CALENDAR_EVENT",
      table_name: "school_calendar",
      record_id: id,
      old_value: JSON.stringify({
        date: event?.date,
        type: event?.type,
        description: event?.description,
        created_by: event?.created_by,
      }),
      new_value: null,
    });

    res.json({ message: "Event removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateEvent(req, res) {
  try {
    const id = req.params.id;

    // Get old values before update
    const [oldEvent] = await calendarModel.getCalendarEventById(id);

    await calendarModel.updateCalendarEvent(id, req.body);

    // LOG UPDATE EVENT
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_CALENDAR_EVENT",
      table_name: "school_calendar",
      record_id: id,
      old_value: JSON.stringify({
        date: oldEvent?.date,
        type: oldEvent?.type,
        description: oldEvent?.description,
      }),
      new_value: JSON.stringify({
        date: req.body.date,
        type: req.body.type,
        description: req.body.description,
      }),
    });

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
