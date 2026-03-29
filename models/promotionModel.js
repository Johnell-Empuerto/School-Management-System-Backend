const db = require("../config/db");

const getPromotionStudents = async (school_year_id, grade, section) => {
  let query = `
    SELECT
      e.id AS enrollment_id,
      s.id AS student_id,
      s.first_name,
      s.last_name,
      c.grade_level,
      c.section
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN classes c ON e.class_id = c.id
    WHERE e.school_year_id = ?
    AND e.enrollment_status = 'enrolled'
  `;

  const params = [school_year_id];

  if (grade) {
    query += " AND c.grade_level = ?";
    params.push(grade);
  }

  if (section) {
    query += " AND c.section = ?";
    params.push(section);
  }

  const [rows] = await db.query(query, params);

  return rows;
};

const completeEnrollment = async (enrollment_id) => {
  const [result] = await db.query(
    `UPDATE enrollments
     SET enrollment_status='completed'
     WHERE id=?`,
    [enrollment_id],
  );

  return result;
};

const insertEnrollment = async (student_id, class_id, school_year_id) => {
  const [result] = await db.query(
    `
    INSERT INTO enrollments
    (student_id, class_id, school_year_id, enrollment_status)
    SELECT ?, ?, ?, 'enrolled'
    WHERE NOT EXISTS (
      SELECT 1
      FROM enrollments
      WHERE student_id=? AND school_year_id=?
    )
    `,
    [student_id, class_id, school_year_id, student_id, school_year_id],
  );

  return result;
};

const updateStudentStatus = async (student_id, status) => {
  const [result] = await db.query(`UPDATE students SET status=? WHERE id=?`, [
    status,
    student_id,
  ]);

  return result;
};

const getNextYearClasses = async (school_year_id) => {
  const [rows] = await db.query(
    `
    SELECT id, grade_level, section
    FROM classes
    WHERE school_year_id = ?
    ORDER BY grade_level, section
    `,
    [school_year_id],
  );

  return rows;
};

// NEW - get enrollment details
const getEnrollmentDetails = async (enrollment_id) => {
  const [rows] = await db.query(
    `
    SELECT 
      e.id,
      e.student_id,
      e.class_id,
      e.school_year_id,
      e.enrollment_status,
      s.first_name,
      s.last_name,
      c.grade_level,
      c.section
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN classes c ON e.class_id = c.id
    WHERE e.id = ?
    `,
    [enrollment_id],
  );

  return rows[0];
};

// NEW - get student details
const getStudentDetails = async (student_id) => {
  const [rows] = await db.query(
    `
    SELECT 
      id,
      first_name,
      last_name,
      status
    FROM students
    WHERE id = ?
    `,
    [student_id],
  );

  return rows[0];
};

module.exports = {
  getPromotionStudents,
  completeEnrollment,
  insertEnrollment,
  updateStudentStatus,
  getNextYearClasses,
  getEnrollmentDetails,
  getStudentDetails,
};
