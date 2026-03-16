const subjectModel = require("../models/subjectModel");

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

    await subjectModel.createSubject(subject_name, subject_code);

    res.json({ message: "Subject created successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await subjectModel.deleteSubject(id);

    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Can't delete because its being used!" });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
};
