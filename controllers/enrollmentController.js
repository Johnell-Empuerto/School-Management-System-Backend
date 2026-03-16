const enrollmentModel = require("../models/enrollmentModel");

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
    const data = req.body;

    await enrollmentModel.createEnrollment(data);

    res.json({
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteEnrollment(req, res) {
  try {
    const id = req.params.id;

    await enrollmentModel.deleteEnrollment(id);

    res.json({
      message: "Enrollment removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Can't delete student used drop" });
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

    await enrollmentModel.createEnrollment({
      student_id,
      class_id,
      school_year_id,
    });

    res.json({
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function dropEnrollment(req, res) {
  try {
    const id = req.params.id;

    await enrollmentModel.dropEnrollment(id);

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

    await enrollmentModel.restoreEnrollment(id);

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
