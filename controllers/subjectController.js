const subjectModel = require("../models/subjectModel");
const logAction = require("../utils/auditLogger");

const getSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel.getSubjects();

    res.json(subjects);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;

    if (!subject_name || !subject_code) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await subjectModel.createSubject(subject_name, subject_code);

    // LOG CREATE SUBJECT ACTION
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_SUBJECT",
      table_name: "subjects",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({ subject_name, subject_code }),
    });

    res.json({ message: "Subject created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Get subject details before deletion for logging
    const [subject] = await subjectModel.getSubjectById(id);

    await subjectModel.deleteSubject(id);

    // LOG DELETE SUBJECT ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_SUBJECT",
      table_name: "subjects",
      record_id: id,
      old_value: JSON.stringify(subject),
      new_value: null,
    });

    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Can't delete because its being used!" });
  }
};

// Optional: Add update subject function if needed
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name, subject_code } = req.body;

    if (!subject_name || !subject_code) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Get old values before update
    const [oldSubject] = await subjectModel.getSubjectById(id);

    await subjectModel.updateSubject(id, subject_name, subject_code);

    // LOG UPDATE SUBJECT ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_SUBJECT",
      table_name: "subjects",
      record_id: id,
      old_value: JSON.stringify({
        subject_name: oldSubject?.subject_name,
        subject_code: oldSubject?.subject_code,
      }),
      new_value: JSON.stringify({ subject_name, subject_code }),
    });

    res.json({ message: "Subject updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
  updateSubject, // Export if you add the update function
};
