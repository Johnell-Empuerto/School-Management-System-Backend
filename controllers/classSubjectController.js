const classSubjectModel = require("../models/classSubjectModel");

async function getAllClassSubjects(req, res) {
  try {
    const data = await classSubjectModel.getAllClassSubjects();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createClassSubject(req, res) {
  try {
    const data = req.body;

    await classSubjectModel.createClassSubject(data);

    res.json({
      message: "Class subject assigned successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function deleteClassSubject(req, res) {
  try {
    const id = req.params.id;

    await classSubjectModel.deleteClassSubject(id);

    res.json({
      message: "Assignment deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateClassSubject(req, res) {
  try {
    const id = req.params.id;
    const { teacher_id } = req.body;

    await classSubjectModel.updateClassSubject(id, teacher_id);

    res.json({
      message: "Teacher updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
}

async function getTeacherClassSubjects(req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = req.session.user;

    let data;

    // ADMIN → see all
    if (user.role === "admin") {
      data = await classSubjectModel.getAllClassSubjects();
    }
    // TEACHER → see only assigned
    else if (user.role === "teacher") {
      data = await classSubjectModel.getTeacherClassSubjects(user.id);
    }
    // OTHER → no access
    else {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllClassSubjects,
  createClassSubject,
  deleteClassSubject,
  updateClassSubject,
  getTeacherClassSubjects,
};
