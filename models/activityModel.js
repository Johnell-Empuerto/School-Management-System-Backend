const db = require("../config/db");

const getActivities = async (search, sort, limit, offset) => {
  const allowedSort = ["activity_date", "title", "type"];
  const sortColumn = allowedSort.includes(sort) ? sort : "activity_date";

  const [rows] = await db.query(
    `
    SELECT 
      a.id,
      a.title,
      a.description,
      a.activity_date,
      a.type,
      a.created_at,
      u.school_id
    FROM activities a
    LEFT JOIN users u
      ON a.created_by = u.id
    WHERE a.title LIKE ?
       OR a.description LIKE ?
    ORDER BY ${sortColumn} DESC
    LIMIT ? OFFSET ?
    `,
    [`%${search}%`, `%${search}%`, limit, offset],
  );

  return rows;
};

const countActivities = async (search) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) as total
    FROM activities
    WHERE title LIKE ?
       OR description LIKE ?
    `,
    [`%${search}%`, `%${search}%`],
  );

  return rows[0].total;
};

const createActivity = async (
  title,
  description,
  activity_date,
  type,
  user_id,
) => {
  const [result] = await db.query(
    `INSERT INTO activities
    (title, description, activity_date, type, created_by)
    VALUES (?, ?, ?, ?, ?)`,
    [title, description, activity_date, type, user_id],
  );

  return result;
};

const updateActivity = async (id, title, description, activity_date, type) => {
  const [result] = await db.query(
    `UPDATE activities
     SET title=?, description=?, activity_date=?, type=?
     WHERE id=?`,
    [title, description, activity_date, type, id],
  );

  return result;
};

const deleteActivity = async (id) => {
  const [result] = await db.query(`DELETE FROM activities WHERE id=?`, [id]);

  return result;
};

module.exports = {
  getActivities,
  createActivity,
  deleteActivity,
  updateActivity,
  countActivities,
};
