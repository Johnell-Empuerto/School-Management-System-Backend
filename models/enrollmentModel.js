const db = require("../config/db");

async function getAllEnrollments() {
  const [rows] = await db.query(`
        SELECT 
            e.id,
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

  await db.query(
    `
    INSERT INTO enrollments
    (student_id, class_id, school_year_id)
    VALUES (?, ?, ?)
    `,
    [student_id, class_id, school_year_id],
  );
}

async function deleteEnrollment(id) {
  await db.query(`DELETE FROM enrollments WHERE id = ?`, [id]);
}

async function dropEnrollment(id) {
  await db.query(
    `
    UPDATE enrollments
    SET enrollment_status = 'dropped'
    WHERE id = ?
    `,
    [id],
  );
}

async function restoreEnrollment(id) {
  await db.query(
    `
    UPDATE enrollments
    SET enrollment_status = 'enrolled'
    WHERE id = ?
    `,
    [id],
  );
}

module.exports = {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
  dropEnrollment,
  restoreEnrollment,
};
