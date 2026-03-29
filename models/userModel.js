const db = require("../config/db");

// existing
async function getUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

// NEW - get user by ID
async function getUserById(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows;
}

// existing
async function getLogin(school_id) {
  const [rows] = await db.query(
    `
    SELECT 
        u.id,
        u.school_id,
        u.password,
        u.role,
        u.status,

        s.first_name AS student_first_name,
        s.last_name AS student_last_name,
        s.profile_photo AS student_photo,

        t.first_name AS teacher_first_name,
        t.last_name AS teacher_last_name,
        t.profile_photo AS teacher_photo

    FROM users u
    LEFT JOIN students s ON s.user_id = u.id
    LEFT JOIN teachers t ON t.user_id = u.id
    WHERE u.school_id = ?
    `,
    [school_id],
  );

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
  getUserById,
  getLogin,
  createUser,
  updateUserStatus,
  updateUser,
  checkSchoolIdExists,
};
