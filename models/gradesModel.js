const db = require("../config/db");

async function getGradesByClassSubject(class_subject_id, grading_period) {
  const [rows] = await db.query(
    `
    SELECT 
        g.id,
        e.id AS enrollment_id,
        s.first_name,
        s.last_name,
        g.grade
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    LEFT JOIN grades g 
        ON g.enrollment_id = e.id 
        AND g.class_subject_id = ?
        AND g.grading_period = ?
    WHERE e.class_id = (
        SELECT class_id 
        FROM class_subjects 
        WHERE id = ?
    )
    `,
    [class_subject_id, grading_period, class_subject_id],
  );

  return rows;
}

async function saveGrade(data) {
  const { enrollment_id, class_subject_id, grading_period, grade } = data;

  const [existing] = await db.query(
    `SELECT id FROM grades 
     WHERE enrollment_id=? 
     AND class_subject_id=? 
     AND grading_period=?`,
    [enrollment_id, class_subject_id, grading_period],
  );

  if (existing.length > 0) {
    await db.query(`UPDATE grades SET grade=? WHERE id=?`, [
      grade,
      existing[0].id,
    ]);
  } else {
    await db.query(
      `INSERT INTO grades (enrollment_id, class_subject_id, grading_period, grade)
       VALUES (?, ?, ?, ?)`,
      [enrollment_id, class_subject_id, grading_period, grade],
    );
  }
}

module.exports = {
  getGradesByClassSubject,
  saveGrade,
};
