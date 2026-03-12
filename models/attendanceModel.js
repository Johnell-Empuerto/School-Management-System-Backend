const db = require("../config/db");

async function getAttendance(class_subject_id, month, year) {
  const [students] = await db.query(
    `
    SELECT 
        e.id AS enrollment_id,
        s.first_name,
        s.last_name
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    WHERE e.class_id = (
        SELECT class_id FROM class_subjects WHERE id = ?
    )
    `,
    [class_subject_id],
  );

  const [records] = await db.query(
    `
    SELECT enrollment_id, DAY(date) AS day, status
    FROM attendance
    WHERE class_subject_id = ?
    AND MONTH(date) = ?
    AND YEAR(date) = ?
    `,
    [class_subject_id, month, year],
  );

  // build attendance map
  const attendanceMap = {};

  records.forEach((r) => {
    if (!attendanceMap[r.enrollment_id]) {
      attendanceMap[r.enrollment_id] = {};
    }

    attendanceMap[r.enrollment_id][r.day] = r.status;
  });

  const result = students.map((student) => ({
    ...student,
    attendance: attendanceMap[student.enrollment_id] || {},
  }));

  return result;
}
async function saveAttendance(data) {
  const { enrollment_id, class_subject_id, date, status } = data;

  // if teacher clears the cell (blank)
  if (!status) {
    await db.query(
      `
      DELETE FROM attendance
      WHERE enrollment_id=? 
      AND class_subject_id=? 
      AND date=?
      `,
      [enrollment_id, class_subject_id, date],
    );

    return;
  }

  // otherwise insert or update attendance
  await db.query(
    `
    INSERT INTO attendance (enrollment_id, class_subject_id, date, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?
    `,
    [enrollment_id, class_subject_id, date, status, status],
  );
}

module.exports = {
  getAttendance,
  saveAttendance,
};
