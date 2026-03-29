const db = require("../config/db");

async function getCalendarEvents() {
  const [rows] = await db.query(`
    SELECT id, date, type, description, created_by
    FROM school_calendar
    ORDER BY date
  `);

  return rows;
}

// NEW - get calendar event by ID
async function getCalendarEventById(id) {
  const [rows] = await db.query(
    `
    SELECT id, date, type, description, created_by
    FROM school_calendar
    WHERE id = ?
    `,
    [id],
  );

  return rows;
}

async function createCalendarEvent(data) {
  const { date, type, description, created_by } = data;

  const [result] = await db.query(
    `
    INSERT INTO school_calendar (date, type, description, created_by)
    VALUES (?, ?, ?, ?)
    `,
    [date, type, description, created_by],
  );

  return result;
}

async function deleteCalendarEvent(id) {
  const [result] = await db.query(`DELETE FROM school_calendar WHERE id = ?`, [
    id,
  ]);
  return result;
}

async function updateCalendarEvent(id, data) {
  const { date, type, description } = data;

  const [result] = await db.query(
    `
    UPDATE school_calendar
    SET date = ?, type = ?, description = ?
    WHERE id = ?
    `,
    [date, type, description, id],
  );

  return result;
}

module.exports = {
  getCalendarEvents,
  getCalendarEventById,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
};
