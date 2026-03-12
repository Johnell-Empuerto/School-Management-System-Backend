const db = require("../config/db");

async function getAllStudents() {
  const [rows] = await db.query(`
    SELECT 
        students.id,
        users.school_id,
        students.first_name,
        students.middle_name,
        students.last_name,
        students.suffix_name,
        students.age,
        students.birthdate,
        students.gender,
        students.contact_number,
        students.address,
        students.guardian_name,
        students.guardian_contact,
        students.profile_photo,
        students.status
    FROM students
    JOIN users ON students.user_id = users.id
  `);

  return rows;
}

async function createStudent(data) {
  const {
    school_id,
    first_name,
    last_name,
    middle_name,
    suffix_name,
    age,
    birthdate,
    gender,
    contact_number,
    address,
    guardian_name,
    guardian_contact,
    profile_photo,
  } = data;

  // Step 1: find user id using school_id
  const [user] = await db.query("SELECT id FROM users WHERE school_id = ?", [
    school_id,
  ]);

  if (user.length === 0) {
    throw new Error(
      "User with this school_id not found! Please create user first and contact the administrator",
    );
  }

  const user_id = user[0].id;

  // Step 2: insert student
  const [result] = await db.query(
    `INSERT INTO students 
      (user_id, first_name, last_name, middle_name, suffix_name, age, 
       birthdate, gender, contact_number, address, guardian_name, guardian_contact, 
       profile_photo, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      first_name,
      last_name,
      middle_name,
      suffix_name,
      age,
      birthdate,
      gender,
      contact_number,
      address,
      guardian_name,
      guardian_contact,
      profile_photo,
      "active",
    ],
  );

  return result;
}

async function updateStudent(id, data) {
  const {
    first_name,
    middle_name,
    last_name,
    suffix_name,
    age,
    birthdate,
    gender,
    contact_number,
    address,
    guardian_name,
    guardian_contact,
    profile_photo,
    status,
  } = data;

  const [result] = await db.query(
    `UPDATE students
     SET 
       first_name = ?,
       middle_name = ?,
       last_name = ?,
       suffix_name = ?,
       age = ?,
       birthdate = ?,
       gender = ?,
       contact_number = ?,
       address = ?,
       guardian_name = ?,
       guardian_contact = ?,
       profile_photo = ?,
       status = ?
     WHERE id = ?`,
    [
      first_name,
      middle_name,
      last_name,
      suffix_name,
      age,
      birthdate,
      gender,
      contact_number,
      address,
      guardian_name,
      guardian_contact,
      profile_photo,
      status,
      id,
    ],
  );

  return result;
}

async function deleteStudent(id) {
  const [result] = await db.query("DELETE FROM students WHERE id=?", [id]);
  return result;
}

async function getStudentsByClass(class_id) {
  const [rows] = await db.query(
    `
    SELECT
        s.id,
        s.first_name,
        s.last_name
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    WHERE e.class_id = ?
    AND e.enrollment_status = 'enrolled'
    ORDER BY s.last_name
    `,
    [class_id],
  );

  return rows;
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
};
