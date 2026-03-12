const db = require("../config/db");

const getAllClasses = async () => {
  const [rows] = await db.query(`
    SELECT 
      c.id,
      c.grade_level,
      c.section,
      CONCAT(s.year_start,'-',s.year_end) AS school_year
    FROM classes c
    LEFT JOIN school_years s
    ON c.school_year_id = s.id
    ORDER BY grade_level ASC, section ASC
  `);

  return rows;
};

const createClass = async (grade_level, section, school_year_id) => {
  const [result] = await db.query(
    "INSERT INTO classes (grade_level, section, school_year_id) VALUES (?,?,?)",
    [grade_level, section, school_year_id],
  );

  return result;
};

const deleteClass = async (id) => {
  const [result] = await db.query("DELETE FROM classes WHERE id = ?", [id]);

  return result;
};

const getClassesBySchoolYear = async (school_year_id) => {
  const [rows] = await db.query(
    `
    SELECT 
      c.id,
      c.grade_level,
      c.section,
      CONCAT(s.year_start,'-',s.year_end) AS school_year
    FROM classes c
    LEFT JOIN school_years s
    ON c.school_year_id = s.id
    WHERE c.school_year_id = ?
    ORDER BY c.grade_level ASC, c.section ASC
    `,
    [school_year_id],
  );

  return rows;
};

module.exports = {
  getAllClasses,
  createClass,
  deleteClass,
  getClassesBySchoolYear,
};
