const db = require("../config/db");

const getSchoolYears = async () => {
  const [rows] = await db.query(
    "SELECT id, CONCAT(year_start,'-',year_end) AS year FROM school_years",
  );

  return rows;
};

/* FULL DATA FOR MANAGEMENT PAGE */

const getSchoolYearsFull = async () => {
  const [rows] = await db.query(`
    SELECT 
      id,
      year_start,
      year_end,
      is_active,
      CONCAT(year_start,'-',year_end) AS year
    FROM school_years
    ORDER BY year_start DESC
  `);

  return rows;
};

const createSchoolYear = async (year_start, year_end) => {
  await db.query(
    `INSERT INTO school_years (year_start, year_end)
     VALUES (?, ?)`,
    [year_start, year_end],
  );
};

const updateSchoolYear = async (id, year_start, year_end) => {
  await db.query(
    `UPDATE school_years
     SET year_start = ?, year_end = ?
     WHERE id = ?`,
    [year_start, year_end, id],
  );
};

const deleteSchoolYear = async (id) => {
  const [[year]] = await db.query(
    "SELECT is_active FROM school_years WHERE id = ?",
    [id],
  );

  if (year.is_active) {
    throw new Error("Cannot delete active school year");
  }

  await db.query("DELETE FROM school_years WHERE id = ?", [id]);
};

const activateSchoolYear = async (id) => {
  await db.query("UPDATE school_years SET is_active = FALSE");

  await db.query("UPDATE school_years SET is_active = TRUE WHERE id = ?", [id]);
};

const getActiveSchoolYear = async () => {
  const [rows] = await db.query(`
    SELECT 
      id,
      year_start,
      year_end,
      CONCAT(year_start,'-',year_end) AS year
    FROM school_years
    WHERE is_active = TRUE
    LIMIT 1
  `);

  return rows[0];
};

module.exports = {
  getSchoolYears,
  getSchoolYearsFull,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  activateSchoolYear,
  getActiveSchoolYear,
};
