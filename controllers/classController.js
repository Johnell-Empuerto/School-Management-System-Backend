const classModel = require("../models/classModel");
const logAction = require("../utils/auditLogger");

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

    const result = await classModel.createClass(
      grade_level,
      section,
      school_year_id,
    );

    // LOG CREATE CLASS
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_CLASS",
      table_name: "classes",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        grade_level,
        section,
        school_year_id,
      }),
    });

    res.json({ message: "Class created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Get class details before deletion for logging
    const [classData] = await classModel.getClassById(id);

    await classModel.deleteClass(id);

    // LOG DELETE CLASS
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_CLASS",
      table_name: "classes",
      record_id: id,
      old_value: JSON.stringify({
        grade_level: classData?.grade_level,
        section: classData?.section,
        school_year_id: classData?.school_year_id,
      }),
      new_value: null,
    });

    res.json({ message: "Class deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Can't delete class because it's being used!" });
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

// Optional: Update class function if needed
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade_level, section, school_year_id } = req.body;

    // Get old values before update
    const [oldClass] = await classModel.getClassById(id);

    await classModel.updateClass(id, grade_level, section, school_year_id);

    // LOG UPDATE CLASS
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_CLASS",
      table_name: "classes",
      record_id: id,
      old_value: JSON.stringify({
        grade_level: oldClass?.grade_level,
        section: oldClass?.section,
        school_year_id: oldClass?.school_year_id,
      }),
      new_value: JSON.stringify({
        grade_level,
        section,
        school_year_id,
      }),
    });

    res.json({ message: "Class updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClasses,
  createClass,
  deleteClass,
  getClassesBySchoolYear,
  updateClass, // Export if needed
};
