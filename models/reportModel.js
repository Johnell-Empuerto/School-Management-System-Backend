const db = require("../config/db");

/* ================= STUDENT REPORT CARD ================= */

async function getStudentReport(student_id, class_id, school_year_id) {
  const [rows] = await db.query(
    `
SELECT 
s.first_name,
s.last_name,
sub.subject_name,

MAX(CASE WHEN g.grading_period='1st' THEN g.grade END) AS q1,
MAX(CASE WHEN g.grading_period='2nd' THEN g.grade END) AS q2,
MAX(CASE WHEN g.grading_period='3rd' THEN g.grade END) AS q3,
MAX(CASE WHEN g.grading_period='4th' THEN g.grade END) AS q4,

AVG(g.grade) AS final_grade,

c.grade_level,
c.section,
sy.year_start,
sy.year_end

FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN class_subjects cs ON cs.class_id = e.class_id
JOIN subjects sub ON cs.subject_id = sub.id

LEFT JOIN grades g 
ON g.enrollment_id = e.id
AND g.class_subject_id = cs.id

JOIN classes c ON e.class_id = c.id
JOIN school_years sy ON e.school_year_id = sy.id

WHERE 
s.id = ?
AND e.class_id = ?
AND e.school_year_id = ?

GROUP BY
sub.subject_name,
c.grade_level,
c.section,
sy.year_start,
sy.year_end
`,
    [student_id, class_id, school_year_id],
  );

  return rows;
}

/* ================= CLASS REPORT ================= */

async function getClassReport(class_id, school_year_id) {
  const [rows] = await db.query(
    `
SELECT 
s.id AS student_id,
s.first_name,
s.last_name,
sub.subject_name,

MAX(CASE WHEN g.grading_period='1st' THEN g.grade END) AS q1,
MAX(CASE WHEN g.grading_period='2nd' THEN g.grade END) AS q2,
MAX(CASE WHEN g.grading_period='3rd' THEN g.grade END) AS q3,
MAX(CASE WHEN g.grading_period='4th' THEN g.grade END) AS q4,

AVG(g.grade) AS final_grade

FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN class_subjects cs ON cs.class_id = e.class_id
JOIN subjects sub ON cs.subject_id = sub.id

LEFT JOIN grades g
ON g.enrollment_id = e.id
AND g.class_subject_id = cs.id

WHERE 
e.class_id = ?
AND e.school_year_id = ?

GROUP BY
s.id,
sub.subject_name

ORDER BY s.last_name, sub.subject_name
`,
    [class_id, school_year_id],
  );

  return rows;
}
/* ================= ATTENDANCE SUMMARY ================= */

async function getAttendanceSummary(class_id, school_year_id) {
  const [rows] = await db.query(
    `
SELECT 
s.first_name,
s.last_name,

SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) AS present,
SUM(CASE WHEN a.status='absent' THEN 1 ELSE 0 END) AS absent,
SUM(CASE WHEN a.status='late' THEN 1 ELSE 0 END) AS late

FROM attendance a
JOIN enrollments e ON a.enrollment_id = e.id
JOIN students s ON e.student_id = s.id

WHERE 
e.class_id = ?
AND e.school_year_id = ?
AND EXISTS (
    SELECT 1
    FROM school_calendar sc
    WHERE sc.date = a.date
    AND sc.type = 'class'
)

GROUP BY s.id
`,
    [class_id, school_year_id],
  );

  return rows;
}

async function getEnrolledStudents() {
  const [rows] = await db.query(`
        SELECT DISTINCT
            s.id,
            s.first_name,
            s.last_name
        FROM enrollments e
        JOIN students s ON e.student_id = s.id
        WHERE e.enrollment_status = 'enrolled'
    `);

  return rows;
}

async function getStudentsByClassYear(class_id, school_year_id) {
  const [rows] = await db.query(
    `
SELECT 
s.id,
s.first_name,
s.last_name
FROM enrollments e
JOIN students s ON e.student_id = s.id
WHERE 
e.class_id = ?
AND e.school_year_id = ?
ORDER BY s.last_name
`,
    [class_id, school_year_id],
  );

  return rows;
}

module.exports = {
  getStudentReport,
  getClassReport,
  getAttendanceSummary,
  getEnrolledStudents,
  getStudentsByClassYear,
};
