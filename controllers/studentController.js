const studentModel = require("../models/studentModel");

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
    res.json({ message: "Student created", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStudent(req, res) {
  try {
    const result = await studentModel.updateStudent(req.params.id, req.body);
    res.json({ message: "Student updated", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteStudent(req, res) {
  try {
    const result = await studentModel.deleteStudent(req.params.id);
    res.json({ message: "Student deleted", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cant delete student because its  enrolled already" });
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

module.exports = {
  deleteStudent,
  updateStudent,
  createStudent,
  getStudents,
  getStudentsByClass,
};
