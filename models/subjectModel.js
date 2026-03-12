const db = require("../config/db");

const getSubjects = async () => {
  const [rows] = await db.query("SELECT * FROM subjects");
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

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
};
