const db = require("../config/db");

/* ======================================================
GET ACTIVE SCHOOL YEAR
====================================================== */

const getActiveSchoolYear = async () => {
  const [[year]] = await db.query(`
        SELECT id, year_start, year_end
        FROM school_years
        WHERE is_active = TRUE
        LIMIT 1
    `);

  if (!year) {
    throw new Error("No active school year found");
  }

  return year;
};

/* ======================================================
DASHBOARD MAIN STATS
====================================================== */

const getDashboardStats = async () => {
  const activeYear = await getActiveSchoolYear();
  const schoolYearId = activeYear.id;

  const [[students]] = await db.query(
    `
  SELECT COUNT(*) AS total_students
  FROM enrollments
  WHERE school_year_id = ?
  AND enrollment_status='enrolled'
  `,
    [schoolYearId],
  );

  const [[teachers]] = await db.query(`
        SELECT COUNT(*) AS total_teachers
FROM teachers
WHERE status NOT IN ('retired', 'resigned');
    `);

  const [[classes]] = await db.query(
    `
        SELECT COUNT(*) AS total_classes
        FROM classes
        WHERE school_year_id = ?
    `,
    [schoolYearId],
  );

  const [[subjects]] = await db.query(`
        SELECT COUNT(*) AS total_subjects
        FROM subjects
    `);

  const [[enrolled]] = await db.query(
    `
        SELECT COUNT(*) AS total_enrolled
        FROM enrollments
        WHERE school_year_id = ?
        AND enrollment_status='enrolled'
    `,
    [schoolYearId],
  );

  const [[pendingRequests]] = await db.query(
    `
        SELECT COUNT(*) AS pending_requests
        FROM enrollment_requests
        WHERE school_year_id = ?
        AND status='pending'
    `,
    [schoolYearId],
  );

  return {
    school_year: `${activeYear.year_start}-${activeYear.year_end}`,
    students: students.total_students,
    teachers: teachers.total_teachers,
    classes: classes.total_classes,
    subjects: subjects.total_subjects,
    enrolled: enrolled.total_enrolled,
    pending_requests: pendingRequests.pending_requests,
  };
};

/* ======================================================
STUDENT ATTENDANCE CHART
====================================================== */

const getStudentAttendanceStats = async (user_id) => {
  const activeYear = await getActiveSchoolYear();
  const schoolYearId = activeYear.id;

  const [rows] = await db.query(
    `
        SELECT a.status, COUNT(*) as total
        FROM attendance a
        JOIN enrollments e ON a.enrollment_id = e.id
        JOIN students s ON e.student_id = s.id
        WHERE s.user_id = ?
        AND e.school_year_id = ?
        GROUP BY a.status
    `,
    [user_id, schoolYearId],
  );

  return rows;
};

/* ======================================================
SYSTEM ATTENDANCE CHART (ADMIN / TEACHER)
====================================================== */

const getAttendanceChart = async () => {
  const activeYear = await getActiveSchoolYear();
  const schoolYearId = activeYear.id;

  const [rows] = await db.query(
    `
        SELECT a.status, COUNT(*) as total
        FROM attendance a
        JOIN enrollments e ON a.enrollment_id = e.id
        WHERE e.school_year_id = ?
        GROUP BY a.status
    `,
    [schoolYearId],
  );

  return rows;
};

module.exports = {
  getDashboardStats,
  getStudentAttendanceStats,
  getAttendanceChart,
  getActiveSchoolYear,
};
