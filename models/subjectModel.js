const db = require("../config/db");

const getSubjects = async () => {
  const [rows] = await db.query("SELECT * FROM subjects");
  return rows;
};

// NEW - get subject by ID
const getSubjectById = async (id) => {
  const [rows] = await db.query("SELECT * FROM subjects WHERE id = ?", [id]);
  return rows;
};

const createSubject = async (subject_name, subject_code) => {
  const [result] = await db.query(
    "INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)",
    [subject_name, subject_code],
  );

  return result;
};

const deleteSubject = async (id) => {
  const [result] = await db.query("DELETE FROM subjects WHERE id = ?", [id]);

  return result;
};

// Optional: Add update subject function if needed
const updateSubject = async (id, subject_name, subject_code) => {
  const [result] = await db.query(
    "UPDATE subjects SET subject_name = ?, subject_code = ? WHERE id = ?",
    [subject_name, subject_code, id],
  );

  return result;
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
  updateSubject, // Export if you add the update function
};
