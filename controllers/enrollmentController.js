const enrollmentModel = require("../models/enrollmentModel");
const db = require("../config/db");
const logAction = require("../utils/auditLogger");

async function getAllEnrollments(req, res) {
  try {
    const data = await enrollmentModel.getAllEnrollments();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createEnrollment(req, res) {
  try {
    const { student_id, class_id, school_year_id } = req.body;

    const user = req.session.user;

    // STUDENT VALIDATION
    if (user.role === "student") {
      const [student] = await db.query(
        "SELECT id FROM students WHERE user_id = ?",
        [user.id],
      );

      if (student.length === 0 || student[0].id != student_id) {
        return res.status(403).json({
          message: "Students can only enroll themselves",
        });
      }
    }

    const result = await enrollmentModel.createEnrollment({
      student_id,
      class_id,
      school_year_id,
    });

    // LOG CREATE ENROLLMENT
    await logAction({
      user_id: req.session.user.id,
      action: "CREATE_ENROLLMENT",
      table_name: "enrollments",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        student_id,
        class_id,
        school_year_id,
        enrollment_status: "enrolled",
      }),
    });

    res.json({
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function deleteEnrollment(req, res) {
  try {
    const id = req.params.id;

    // Get enrollment details before deletion for logging
    const [enrollment] = await enrollmentModel.getEnrollmentById(id);

    await enrollmentModel.deleteEnrollment(id);

    // LOG DELETE ENROLLMENT
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_ENROLLMENT",
      table_name: "enrollments",
      record_id: id,
      old_value: JSON.stringify(enrollment),
      new_value: null,
    });

    res.json({
      message: "Enrollment removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Can't delete student used drop" });
  }
}

async function dropEnrollment(req, res) {
  try {
    const id = req.params.id;

    // Get enrollment details before drop for logging
    const [enrollment] = await enrollmentModel.getEnrollmentById(id);
    const oldStatus = enrollment?.enrollment_status;

    await enrollmentModel.dropEnrollment(id);

    // LOG DROP ENROLLMENT
    await logAction({
      user_id: req.session.user.id,
      action: "DROP_ENROLLMENT",
      table_name: "enrollments",
      record_id: id,
      old_value: oldStatus,
      new_value: "dropped",
    });

    res.json({
      message: "Student dropped successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function restoreEnrollment(req, res) {
  try {
    const id = req.params.id;

    // Get enrollment details before restore for logging
    const [enrollment] = await enrollmentModel.getEnrollmentById(id);
    const oldStatus = enrollment?.enrollment_status;

    await enrollmentModel.restoreEnrollment(id);

    // LOG RESTORE ENROLLMENT
    await logAction({
      user_id: req.session.user.id,
      action: "RESTORE_ENROLLMENT",
      table_name: "enrollments",
      record_id: id,
      old_value: oldStatus,
      new_value: "enrolled",
    });

    res.json({
      message: "Student restored successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
  dropEnrollment,
  restoreEnrollment,
};
