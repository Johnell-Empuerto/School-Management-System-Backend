const teacherModel = require("../models/teacherModel");
const db = require("../config/db");
const logAction = require("../utils/auditLogger");

const getTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.getTeachers();

    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const {
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
    } = req.body;

    const result = await teacherModel.createTeacher(
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
    );

    // LOG CREATE TEACHER ACTION
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_TEACHER",
      table_name: "teachers",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        school_id,
        first_name,
        last_name,
        email,
        department,
        rank_level,
      }),
    });

    res.json({ message: "Teacher created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    // Get teacher details before deletion for logging
    const [teacher] = await teacherModel.getTeacherById(id);

    await teacherModel.deleteTeacher(id);

    // LOG DELETE TEACHER ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_TEACHER",
      table_name: "teachers",
      record_id: id,
      old_value: JSON.stringify(teacher),
      new_value: null,
    });

    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({
      message:
        "Can't delete because it's already has a class assigned or active",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get old status before update
    const [teacher] = await teacherModel.getTeacherById(id);
    const oldStatus = teacher ? teacher.status : null;

    await db.query("UPDATE teachers SET status = ? WHERE id = ?", [status, id]);

    // LOG STATUS UPDATE
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_TEACHER_STATUS",
      table_name: "teachers",
      record_id: id,
      old_value: oldStatus,
      new_value: status,
    });

    res.json({ message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
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
    } = req.body;

    // Get old values before update
    const [oldTeacherData] = await teacherModel.getTeacherById(id);

    await teacherModel.updateTeacher(
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
    );

    // LOG UPDATE TEACHER ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_TEACHER",
      table_name: "teachers",
      record_id: id,
      old_value: JSON.stringify({
        first_name: oldTeacherData?.first_name,
        last_name: oldTeacherData?.last_name,
        email: oldTeacherData?.email,
        department: oldTeacherData?.department,
        rank_level: oldTeacherData?.rank_level,
        specialization: oldTeacherData?.specialization,
        employment_type: oldTeacherData?.employment_type,
      }),
      new_value: JSON.stringify({
        first_name,
        last_name,
        email,
        department,
        rank_level,
        specialization,
        employment_type,
      }),
    });

    res.json({ message: "Teacher updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateStatus,
  updateTeacher,
};
