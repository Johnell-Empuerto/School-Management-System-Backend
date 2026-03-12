const db = require("../config/db");

async function getAllRequests() {
  const [rows] = await db.query(`
        SELECT 
    er.id,
    s.first_name,
    s.last_name,
    c.grade_level,
    c.section,
    CONCAT(sy.year_start,'-',sy.year_end) AS school_year,
    er.status
FROM enrollment_requests er
JOIN students s ON er.student_id = s.id
JOIN classes c ON er.class_id = c.id
JOIN school_years sy ON er.school_year_id = sy.id;
  `);

  return rows;
}
async function createRequest(data) {
  const { student_id, class_id, school_year_id } = data;

  await db.query(
    `
    INSERT INTO enrollment_requests
    (student_id, class_id, school_year_id)
    VALUES (?, ?, ?)
    `,
    [student_id, class_id, school_year_id],
  );
}

async function approveRequest(id) {
  const [request] = await db.query(
    `SELECT * FROM enrollment_requests WHERE id = ?`,
    [id],
  );

  const req = request[0];

  await db.query(
    `
    INSERT INTO enrollments
    (student_id, class_id, school_year_id)
    VALUES (?, ?, ?)
    `,
    [req.student_id, req.class_id, req.school_year_id],
  );

  await db.query(
    `UPDATE enrollment_requests SET status='approved' WHERE id=?`,
    [id],
  );
}

async function rejectRequest(id) {
  await db.query(
    `UPDATE enrollment_requests SET status='rejected' WHERE id=?`,
    [id],
  );
}

module.exports = {
  getAllRequests,
  createRequest,
  approveRequest,
  rejectRequest,
};
