const attendanceModel = require("../models/attendanceModel");

async function getAttendance(req, res) {
  try {
    const { class_subject_id, month, year } = req.params;

    const data = await attendanceModel.getAttendance(
      class_subject_id,
      month,
      year,
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function saveAttendance(req, res) {
  try {
    const data = req.body;

    await attendanceModel.saveAttendance(data);

    res.json({ message: "Attendance saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAttendance,
  saveAttendance,
};
