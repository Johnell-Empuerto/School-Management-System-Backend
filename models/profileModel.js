const db = require("../config/db");

async function getProfile(user_id, role) {
  if (role === "student") {
    const [rows] = await db.query(
      `
  SELECT 
  u.school_id,
  u.role,
  s.email,
  s.first_name,
  s.middle_name,
  s.last_name,
  s.age,
  s.birthdate,
  s.gender,
  s.contact_number,
  s.address,
  s.guardian_name,
  s.guardian_contact,
  s.profile_photo,
  s.status
FROM users u
JOIN students s ON s.user_id = u.id
WHERE u.id = ?
`,
      [user_id],
    );

    return rows;
  }

  if (role === "teacher") {
    const [rows] = await db.query(
      `
    SELECT 
      u.school_id,
      u.role,

      t.first_name,
      t.middle_name,
      t.last_name,
      t.suffix_name,

      t.gender,
      t.birthdate,
      t.age,

      t.contact_number,
      t.email,
      t.address,

      t.department,
      t.rank_level,
      t.specialization,

      t.hire_date,
      t.employment_type,
      t.highest_education,

      t.profile_photo,
      t.status

    FROM users u
    JOIN teachers t ON t.user_id = u.id
    WHERE u.id = ?
`,
      [user_id],
    );

    return rows;
  }

  // admin

  const [rows] = await db.query(
    `
      SELECT 
        school_id,
        role,
        status,
        created_at
      FROM users
      WHERE id = ?
  `,
    [user_id],
  );

  return rows;
}

async function getStudentGrades(user_id) {
  const [rows] = await db.query(
    `
    SELECT 
      sub.subject_name,
      g.grade
    FROM users u
    JOIN students s ON s.user_id = u.id
    JOIN enrollments e ON e.student_id = s.id
    JOIN grades g ON g.enrollment_id = e.id
    JOIN class_subjects cs ON cs.id = g.class_subject_id
    JOIN subjects sub ON sub.id = cs.subject_id
    WHERE u.id = ?
  `,
    [user_id],
  );

  return rows;
}

async function getStudentAttendance(user_id) {
  const [rows] = await db.query(
    `
    SELECT 
      sub.subject_name,
      a.date,
      a.status
    FROM users u
    JOIN students s ON s.user_id = u.id
    JOIN enrollments e ON e.student_id = s.id
    JOIN attendance a ON a.enrollment_id = e.id
    JOIN class_subjects cs ON cs.id = a.class_subject_id
    JOIN subjects sub ON sub.id = cs.subject_id
    WHERE u.id = ?
    ORDER BY a.date DESC
  `,
    [user_id],
  );

  return rows;
}

async function getStudentAttendanceSummary(user_id) {
  const [rows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late
    FROM users u
    JOIN students s ON s.user_id = u.id
    JOIN enrollments e ON e.student_id = s.id
    JOIN attendance a ON a.enrollment_id = e.id
    WHERE u.id = ?
  `,
    [user_id],
  );

  return rows[0];
}

async function updateProfile(user_id, role, data) {
  if (role === "student") {
    await db.query(
      `
    UPDATE students
    SET
      first_name=?,
      middle_name=?,
      last_name=?,
      suffix_name=?,
      gender=?,
      birthdate=?,
      contact_number=?,
      email=?,
      address=?,
      guardian_name=?,
      guardian_contact=?,
      profile_photo=?
    WHERE user_id=?
    `,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.suffix_name || null,
        data.gender,
        data.birthdate,
        data.contact_number,
        data.email,
        data.address,
        data.guardian_name,
        data.guardian_contact,
        data.profile_photo,
        user_id,
      ],
    );
  }

  if (role === "teacher") {
    await db.query(
      `
      UPDATE teachers
      SET
        first_name=?,
        middle_name=?,
        last_name=?,
        suffix_name=?,
        gender=?,
        birthdate=?,
        contact_number=?,
        email=?,
        address=?,
        department=?,
        rank_level=?,
        specialization=?,
        hire_date=?,
        employment_type=?,
        highest_education=?,
        profile_photo=?
      WHERE user_id=?
      `,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.suffix_name,
        data.gender,
        data.birthdate,
        data.contact_number,
        data.email,
        data.address,
        data.department,
        data.rank_level,
        data.specialization,
        data.hire_date || null,
        data.employment_type || null,
        data.highest_education || null,
        data.profile_photo,
        user_id,
      ],
    );
  }
}

module.exports = {
  getProfile,
  getStudentGrades,
  getStudentAttendance,
  getStudentAttendanceSummary,
  updateProfile,
};
