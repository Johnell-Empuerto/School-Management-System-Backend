const db = require("../config/db");

// existing
async function getUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

// existing
async function getLogin(school_id) {
  const [rows] = await db.query("SELECT * FROM users where school_id = ?", [
    school_id,
  ]);
  return rows;
}

// NEW → create user
async function createUser(school_id, password, role) {
  const [result] = await db.query(
    `
    INSERT INTO users (school_id, password, role)
    VALUES (?, ?, ?)
  `,
    [school_id, password, role],
  );

  return result;
}

// NEW → update status
async function updateUserStatus(id, status) {
  const [result] = await db.query(
    `
    UPDATE users
    SET status = ?
    WHERE id = ?
  `,
    [status, id],
  );

  return result;
}

async function updateUser(id, school_id, role) {
  const [result] = await db.query(
    `
    UPDATE users
    SET school_id = ?, role = ?
    WHERE id = ?
  `,
    [school_id, role, id],
  );

  return result;
}

async function checkSchoolIdExists(school_id) {
  const [rows] = await db.query("SELECT id FROM users WHERE school_id = ?", [
    school_id,
  ]);

  return rows.length > 0;
}

module.exports = {
  getUsers,
  getLogin,
  createUser,
  updateUserStatus,
  updateUser,
  checkSchoolIdExists,
};
