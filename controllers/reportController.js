const reportModel = require("../models/reportModel");

async function studentReport(req, res) {
  try {
    const { student_id } = req.params;

    const data = await reportModel.getStudentReport(student_id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function classReport(req, res) {
  try {
    const { class_id } = req.params;

    const data = await reportModel.getClassReport(class_id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function attendanceReport(req, res) {
  try {
    const { class_id } = req.params;

    const data = await reportModel.getAttendanceSummary(class_id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function enrolledStudents(req, res) {
  try {
    const data = await reportModel.getEnrolledStudents();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  studentReport,
  classReport,
  attendanceReport,
  enrolledStudents,
};
