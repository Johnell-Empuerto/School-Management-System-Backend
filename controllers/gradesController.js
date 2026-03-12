const gradesModel = require("../models/gradesModel");

async function getGrades(req, res) {
  try {
    const { class_subject_id, grading_period } = req.params;

    const data = await gradesModel.getGradesByClassSubject(
      class_subject_id,
      grading_period,
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function saveGrade(req, res) {
  try {
    const data = req.body;

    await gradesModel.saveGrade(data);

    res.json({ message: "Grade saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getGrades,
  saveGrade,
};
