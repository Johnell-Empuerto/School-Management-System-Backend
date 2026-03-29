const db = require("../config/db");

async function getAllEnrollments() {
  const [rows] = await db.query(`
    SELECT 
      e.id,
      e.student_id,
      e.class_id,
      e.school_year_id,
      s.first_name,
      s.last_name,
      c.grade_level,
      c.section,
      sy.year_start,
      sy.year_end,
      e.enrollment_status
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN classes c ON e.class_id = c.id
    JOIN school_years sy ON e.school_year_id = sy.id
  `);

  return rows;
}

// NEW - get enrollment by ID
async function getEnrollmentById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      e.id,
      e.student_id,
      e.class_id,
      e.school_year_id,
      s.first_name,
      s.last_name,
      c.grade_level,
      c.section,
      sy.year_start,
      sy.year_end,
      e.enrollment_status,
      e.created_at
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN classes c ON e.class_id = c.id
    JOIN school_years sy ON e.school_year_id = sy.id
    WHERE e.id = ?
    `,
    [id],
  );

  return rows;
}

async function createEnrollment(data) {
  const { student_id, class_id, school_year_id } = data;

  // CHECK EXISTING ENROLLMENT
  const [existing] = await db.query(
    `
    SELECT id
    FROM enrollments
    WHERE student_id = ?
    AND school_year_id = ?
    `,
    [student_id, school_year_id],
  );

  if (existing.length > 0) {
    throw new Error("Student already enrolled for this school year");
  }

  const [result] = await db.query(
    `
    INSERT INTO enrollments
    (student_id, class_id, school_year_id, enrollment_status)
    VALUES (?, ?, ?, 'enrolled')
    `,
    [student_id, class_id, school_year_id],
  );

  return result;
}

async function deleteEnrollment(id) {
  const [result] = await db.query(`DELETE FROM enrollments WHERE id = ?`, [id]);
  return result;
}

async function dropEnrollment(id) {
  const [result] = await db.query(
    `
    UPDATE enrollments
    SET enrollment_status = 'dropped'
    WHERE id = ?
    `,
    [id],
  );
  return result;
}

async function restoreEnrollment(id) {
  const [result] = await db.query(
    `
    UPDATE enrollments
    SET enrollment_status = 'enrolled'
    WHERE id = ?
    `,
    [id],
  );
  return result;
}

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
  dropEnrollment,
  restoreEnrollment,
};
