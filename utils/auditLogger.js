const db = require("../config/db");

async function logAction({
  user_id,
  action,
  table_name,
  record_id = null,
  old_value = null,
  new_value = null,
}) {
  try {
    await db.query(
      `
      INSERT INTO system_logs
      (user_id, action, table_name, record_id, old_value, new_value)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [user_id, action, table_name, record_id, old_value, new_value],
    );
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

module.exports = logAction;
