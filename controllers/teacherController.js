const teacherModel = require("../models/teacherModel");
const db = require("../config/db");

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

    await teacherModel.createTeacher(
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

    res.json({ message: "Teacher created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    await teacherModel.deleteTeacher(id);

    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Can't delete  because its already have a class assigned or active",
      });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query("UPDATE teachers SET status = ? WHERE id = ?", [status, id]);

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
      profile_photo, // ⭐ ADD THIS
    } = req.body;

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
      profile_photo, // ⭐ PASS IT
    );

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
