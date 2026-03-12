const classModel = require("../models/classModel");

const getClasses = async (req, res) => {
  try {
    const classes = await classModel.getAllClasses();

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { grade_level, section, school_year_id } = req.body;

    await classModel.createClass(grade_level, section, school_year_id);

    res.json({ message: "Class created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    await classModel.deleteClass(id);

    res.json({ message: "Class deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cant delete class because its being used!" });
  }
};

const getClassesBySchoolYear = async (req, res) => {
  try {
    const { school_year_id } = req.query;

    const classes = await classModel.getClassesBySchoolYear(school_year_id);

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClasses,
  createClass,
  deleteClass,
  getClassesBySchoolYear,
};
