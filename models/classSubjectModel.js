const db = require("../config/db");

async function getAllClassSubjects() {
  const [rows] = await db.query(`
    SELECT 
      cs.id,
      cs.class_id,
      cs.subject_id,
      cs.teacher_id,
      c.grade_level,
      c.section,
      s.subject_name,
      CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
    FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    JOIN teachers t ON cs.teacher_id = t.id
    ORDER BY c.grade_level, c.section
  `);

  return rows;
}

// NEW - get class subject by ID
async function getClassSubjectById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      cs.id,
      cs.class_id,
      cs.subject_id,
      cs.teacher_id,
      c.grade_level,
      c.section,
      s.subject_name,
      CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
      t.first_name AS teacher_first_name,
      t.last_name AS teacher_last_name
    FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    JOIN teachers t ON cs.teacher_id = t.id
    WHERE cs.id = ?
    `,
    [id],
  );

  return rows;
}

async function createClassSubject(data) {
  const { class_id, subject_id, teacher_id } = data;

  // CHECK IF ALREADY EXISTS
  const [existing] = await db.query(
    `SELECT id
     FROM class_subjects
     WHERE class_id = ? AND subject_id = ?`,
    [class_id, subject_id],
  );

  if (existing.length > 0) {
    throw new Error("This subject is already assigned to the class.");
  }

  const [result] = await db.query(
    `INSERT INTO class_subjects 
     (class_id, subject_id, teacher_id)
     VALUES (?, ?, ?)`,
    [class_id, subject_id, teacher_id],
  );

  return result;
}

async function deleteClassSubject(id) {
  const [result] = await db.query("DELETE FROM class_subjects WHERE id = ?", [
    id,
  ]);

  return result;
}

async function updateClassSubject(id, teacher_id) {
  const [result] = await db.query(
    `UPDATE class_subjects
     SET teacher_id = ?
     WHERE id = ?`,
    [teacher_id, id],
  );

  return result;
}

async function getTeacherClassSubjects(user_id) {
  const [rows] = await db.query(
    `
    SELECT 
      cs.id,
      cs.teacher_id,
      c.grade_level,
      c.section,
      s.subject_name
    FROM class_subjects cs
    JOIN classes c ON cs.class_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    JOIN teachers t ON cs.teacher_id = t.id
    WHERE t.user_id = ?
    ORDER BY c.grade_level, c.section
  `,
    [user_id],
  );

  return rows;
}

module.exports = {
  getAllClassSubjects,
  getClassSubjectById,
  createClassSubject,
  deleteClassSubject,
  updateClassSubject,
  getTeacherClassSubjects,
};
