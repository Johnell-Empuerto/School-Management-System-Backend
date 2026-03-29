const classSubjectModel = require("../models/classSubjectModel");
const logAction = require("../utils/auditLogger");

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

    const result = await classSubjectModel.createClassSubject(data);

    // LOG CREATE CLASS SUBJECT
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_CLASS_SUBJECT",
      table_name: "class_subjects",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        class_id: data.class_id,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
      }),
    });

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

    // Get class subject details before deletion for logging
    const [classSubject] = await classSubjectModel.getClassSubjectById(id);

    await classSubjectModel.deleteClassSubject(id);

    // LOG DELETE CLASS SUBJECT
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_CLASS_SUBJECT",
      table_name: "class_subjects",
      record_id: id,
      old_value: JSON.stringify(classSubject),
      new_value: null,
    });

    res.json({
      message: "Assignment deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Can't delete because it's being used!" });
  }
}

async function updateClassSubject(req, res) {
  try {
    const id = req.params.id;
    const { teacher_id } = req.body;

    // Get old values before update
    const [oldClassSubject] = await classSubjectModel.getClassSubjectById(id);
    const oldTeacherId = oldClassSubject?.teacher_id;

    await classSubjectModel.updateClassSubject(id, teacher_id);

    // LOG UPDATE CLASS SUBJECT
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_CLASS_SUBJECT",
      table_name: "class_subjects",
      record_id: id,
      old_value: oldTeacherId ? oldTeacherId.toString() : null,
      new_value: teacher_id.toString(),
    });

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
