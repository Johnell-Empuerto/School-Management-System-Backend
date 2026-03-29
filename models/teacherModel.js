const db = require("../config/db");

const getTeachers = async () => {
  const [rows] = await db.query(`
    SELECT 
      t.id,
      t.first_name,
      t.middle_name,
      t.last_name,
      t.suffix_name,
      t.gender,
      t.birthdate,
      t.contact_number,
      t.email,
      t.address,
      t.department,
      t.rank_level,
      t.specialization,
      t.hire_date,
      t.employment_type,
      t.highest_education,
      t.age,
      t.status,
      t.profile_photo,
      u.school_id
    FROM teachers t
    LEFT JOIN users u
      ON t.user_id = u.id
  `);

  return rows;
};

// NEW - get teacher by ID
const getTeacherById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      t.id,
      t.first_name,
      t.middle_name,
      t.last_name,
      t.suffix_name,
      t.gender,
      t.birthdate,
      t.contact_number,
      t.email,
      t.address,
      t.department,
      t.rank_level,
      t.specialization,
      t.hire_date,
      t.employment_type,
      t.highest_education,
      t.age,
      t.status,
      t.profile_photo,
      u.school_id
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
    `,
    [id],
  );

  return rows;
};

const createTeacher = async (
  school_id,
  first_name,
  middle_name,
  last_name,
  suffix_name,
  gender,
  birthdate,
  contact_number,
  email,
  address,
  department,
  rank_level,
  specialization,
  hire_date,
  employment_type,
  highest_education,
  age,
  profile_photo,
) => {
  const [user] = await db.query("SELECT id FROM users WHERE school_id = ?", [
    school_id,
  ]);

  if (user.length === 0) {
    throw new Error(
      "User with this school_id not found. Please create the user first.",
    );
  }

  const user_id = user[0].id;

  const [result] = await db.query(
    `
    INSERT INTO teachers (
      user_id,
      first_name,
      middle_name,
      last_name,
      suffix_name,
      gender,
      birthdate,
      contact_number,
      email,
      address,
      department,
      rank_level,
      specialization,
      hire_date,
      employment_type,
      highest_education,
      age,
      profile_photo
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `,
    [
      user_id,
      first_name,
      middle_name,
      last_name,
      suffix_name,
      gender,
      birthdate,
      contact_number,
      email,
      address,
      department,
      rank_level,
      specialization,
      hire_date,
      employment_type,
      highest_education,
      age,
      profile_photo,
    ],
  );

  return result;
};

const deleteTeacher = async (id) => {
  const [result] = await db.query("DELETE FROM teachers WHERE id = ?", [id]);

  return result;
};

const updateTeacher = async (
  id,
  first_name,
  middle_name,
  last_name,
  suffix_name,
  gender,
  birthdate,
  contact_number,
  email,
  address,
  department,
  rank_level,
  specialization,
  hire_date,
  employment_type,
  highest_education,
  age,
  profile_photo,
) => {
  const [result] = await db.query(
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
      age=?,
      profile_photo=?
    WHERE id=?
  `,
    [
      first_name,
      middle_name,
      last_name,
      suffix_name,
      gender,
      birthdate,
      contact_number,
      email,
      address,
      department,
      rank_level,
      specialization,
      hire_date,
      employment_type,
      highest_education,
      age,
      profile_photo,
      id,
    ],
  );

  return result;
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  deleteTeacher,
  updateTeacher,
};
