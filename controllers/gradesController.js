const gradesModel = require("../models/gradesModel");
const logAction = require("../utils/auditLogger");

async function getGrades(req, res) {
  try {
    const { class_subject_id, grading_period, school_year_id } = req.params;

    const data = await gradesModel.getGradesByClassSubject(
      class_subject_id,
      grading_period,
      school_year_id,
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

    const result = await gradesModel.saveGrade(data);

    // LOG THE ACTION
    await logAction({
      user_id: req.session.user.id,
      action: result.action === "INSERT" ? "CREATE_GRADE" : "UPDATE_GRADE",
      table_name: "grades",
      record_id: result.record_id,
      old_value: result.old_value,
      new_value: result.new_value,
    });

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
