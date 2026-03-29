const studentModel = require("../models/studentModel");
const logAction = require("../utils/auditLogger");

async function getStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createStudent(req, res) {
  try {
    const result = await studentModel.createStudent(req.body);

    // Get the created student details for logging
    const [newStudent] = await studentModel.getStudentById(result.insertId);

    // LOG CREATE STUDENT ACTION
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_STUDENT",
      table_name: "students",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        school_id: req.body.school_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        status: "active",
      }),
    });

    res.json({ message: "Student created", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStudent(req, res) {
  try {
    const id = req.params.id;

    // Get old values before update
    const [oldStudent] = await studentModel.getStudentById(id);

    const result = await studentModel.updateStudent(id, req.body);

    // LOG UPDATE STUDENT ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_STUDENT",
      table_name: "students",
      record_id: id,
      old_value: JSON.stringify({
        first_name: oldStudent?.first_name,
        last_name: oldStudent?.last_name,
        gender: oldStudent?.gender,
        contact_number: oldStudent?.contact_number,
        address: oldStudent?.address,
        guardian_name: oldStudent?.guardian_name,
        status: oldStudent?.status,
      }),
      new_value: JSON.stringify({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        contact_number: req.body.contact_number,
        address: req.body.address,
        guardian_name: req.body.guardian_name,
        status: req.body.status,
      }),
    });

    res.json({ message: "Student updated", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteStudent(req, res) {
  try {
    const id = req.params.id;

    // Get student details before deletion for logging
    const [student] = await studentModel.getStudentById(id);

    const result = await studentModel.deleteStudent(id);

    // LOG DELETE STUDENT ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_STUDENT",
      table_name: "students",
      record_id: id,
      old_value: JSON.stringify(student),
      new_value: null,
    });

    res.json({ message: "Student deleted", result });
  } catch (error) {
    res.status(500).json({
      message: "Can't delete student because it's enrolled already",
    });
  }
}

async function getStudentsByClass(req, res) {
  try {
    const { class_id } = req.params;

    const students = await studentModel.getStudentsByClass(class_id);

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStudentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get old status before update
    const [student] = await studentModel.getStudentById(id);
    const oldStatus = student ? student.status : null;

    const result = await studentModel.updateStudentStatus(id, status);

    // LOG STATUS UPDATE
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_STUDENT_STATUS",
      table_name: "students",
      record_id: id,
      old_value: oldStatus,
      new_value: status,
    });

    res.json({ message: "Student status updated", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  deleteStudent,
  updateStudent,
  createStudent,
  getStudents,
  getStudentsByClass,
  updateStudentStatus,
};
