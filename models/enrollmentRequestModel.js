const db = require("../config/db");

async function getAllRequests(school_year_id) {
  let query = `
SELECT 
    er.id,
    er.student_id,
    er.class_id,
    er.school_year_id,
    s.first_name,
    s.last_name,
    c.grade_level,
    c.section,
    CONCAT(sy.year_start,'-',sy.year_end) AS school_year,
    er.status
FROM enrollment_requests er
JOIN students s ON er.student_id = s.id
JOIN classes c ON er.class_id = c.id
JOIN school_years sy ON er.school_year_id = sy.id
`;

  const params = [];

  if (school_year_id) {
    query += ` WHERE er.school_year_id = ?`;
    params.push(school_year_id);
  }

  const [rows] = await db.query(query, params);

  return rows;
}

// NEW - get request by ID
async function getRequestById(id) {
  const [rows] = await db.query(
    `
SELECT 
    er.id,
    er.student_id,
    er.class_id,
    er.school_year_id,
    s.first_name,
    s.last_name,
    c.grade_level,
    c.section,
    CONCAT(sy.year_start,'-',sy.year_end) AS school_year,
    er.status,
    er.created_at
FROM enrollment_requests er
JOIN students s ON er.student_id = s.id
JOIN classes c ON er.class_id = c.id
JOIN school_years sy ON er.school_year_id = sy.id
WHERE er.id = ?
    `,
    [id],
  );

  return rows;
}

async function createRequest(data) {
  const { student_id, class_id, school_year_id } = data;

  const [result] = await db.query(
    `
    INSERT INTO enrollment_requests
    (student_id, class_id, school_year_id, status)
    VALUES (?, ?, ?, 'pending')
    `,
    [student_id, class_id, school_year_id],
  );

  return result;
}

async function approveRequest(id) {
  // GET REQUEST
  const [request] = await db.query(
    `SELECT * FROM enrollment_requests WHERE id = ?`,
    [id],
  );

  if (request.length === 0) {
    throw new Error("Request not found");
  }

  const req = request[0];

  // CHECK IF ALREADY APPROVED
  if (req.status === "approved") {
    throw new Error("Request already approved");
  }

  // VALIDATE CLASS SCHOOL YEAR
  const [classCheck] = await db.query(
    `SELECT school_year_id FROM classes WHERE id = ?`,
    [req.class_id],
  );

  if (classCheck.length === 0) {
    throw new Error("Class not found");
  }

  if (classCheck[0].school_year_id != req.school_year_id) {
    throw new Error("Class does not belong to the selected school year");
  }

  // CHECK EXISTING ENROLLMENT
  const [existing] = await db.query(
    `
    SELECT id
    FROM enrollments
    WHERE student_id = ?
    AND school_year_id = ?
    `,
    [req.student_id, req.school_year_id],
  );

  if (existing.length > 0) {
    throw new Error("Student already enrolled for this school year");
  }

  // INSERT ENROLLMENT
  const [enrollmentResult] = await db.query(
    `
    INSERT INTO enrollments
    (student_id, class_id, school_year_id, enrollment_status)
    VALUES (?, ?, ?, 'enrolled')
    `,
    [req.student_id, req.class_id, req.school_year_id],
  );

  // UPDATE REQUEST
  const [result] = await db.query(
    `
    UPDATE enrollment_requests
    SET status = 'approved'
    WHERE id = ?
    `,
    [id],
  );

  return { result, enrollmentId: enrollmentResult.insertId };
}

async function rejectRequest(id) {
  const [result] = await db.query(
    `UPDATE enrollment_requests SET status='rejected' WHERE id=?`,
    [id],
  );

  return result;
}

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  approveRequest,
  rejectRequest,
};
