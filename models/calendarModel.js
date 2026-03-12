const db = require("../config/db");

async function getCalendarEvents() {
  const [rows] = await db.query(`
        SELECT id, date, type, description
        FROM school_calendar
        ORDER BY date
    `);

  return rows;
}

async function createCalendarEvent(data) {
  const { date, type, description, created_by } = data;

  await db.query(
    `
        INSERT INTO school_calendar (date,type,description,created_by)
        VALUES (?,?,?,?)
    `,
    [date, type, description, created_by],
  );
}

async function deleteCalendarEvent(id) {
  await db.query(`DELETE FROM school_calendar WHERE id=?`, [id]);
}

async function updateCalendarEvent(id, data) {
  const { date, type, description } = data;

  await db.query(
    `
    UPDATE school_calendar
    SET date = ?, type = ?, description = ?
    WHERE id = ?
    `,
    [date, type, description, id],
  );
}

module.exports = {
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
};
