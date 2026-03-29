const schoolYearModel = require("../models/schoolYearModel");
const logAction = require("../utils/auditLogger");

const getSchoolYears = async (req, res) => {
  try {
    const years = await schoolYearModel.getSchoolYears();
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* NEW */

const getSchoolYearsFull = async (req, res) => {
  const years = await schoolYearModel.getSchoolYearsFull();
  res.json(years);
};

const createYear = async (req, res) => {
  try {
    const { year_start, year_end } = req.body;

    const result = await schoolYearModel.createSchoolYear(year_start, year_end);

    // LOG CREATE SCHOOL YEAR ACTION
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_SCHOOL_YEAR",
      table_name: "school_years",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({ year_start, year_end }),
    });

    res.json({ message: "School year created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { year_start, year_end } = req.body;

    // Get old values before update
    const [oldYear] = await schoolYearModel.getSchoolYearById(id);

    await schoolYearModel.updateSchoolYear(id, year_start, year_end);

    // LOG UPDATE SCHOOL YEAR ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_SCHOOL_YEAR",
      table_name: "school_years",
      record_id: id,
      old_value: JSON.stringify({
        year_start: oldYear?.year_start,
        year_end: oldYear?.year_end,
        is_active: oldYear?.is_active,
      }),
      new_value: JSON.stringify({ year_start, year_end }),
    });

    res.json({ message: "School year updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Get school year details before deletion for logging
    const [year] = await schoolYearModel.getSchoolYearById(id);

    await schoolYearModel.deleteSchoolYear(id);

    // LOG DELETE SCHOOL YEAR ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "DELETE_SCHOOL_YEAR",
      table_name: "school_years",
      record_id: id,
      old_value: JSON.stringify({
        year_start: year?.year_start,
        year_end: year?.year_end,
        is_active: year?.is_active,
      }),
      new_value: null,
    });

    res.json({ message: "School year deleted" });
  } catch (error) {
    res.status(500).json({ message: "Can't delete because it's being used!" });
  }
};

const activateYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the previously active year before changing
    const [oldActiveYear] = await schoolYearModel.getActiveSchoolYearFull();
    const [newActiveYear] = await schoolYearModel.getSchoolYearById(id);

    await schoolYearModel.activateSchoolYear(id);

    // LOG ACTIVATE SCHOOL YEAR ACTION
    await logAction({
      user_id: req.session.user.id,
      action: "ACTIVATE_SCHOOL_YEAR",
      table_name: "school_years",
      record_id: id,
      old_value: oldActiveYear
        ? JSON.stringify({
            id: oldActiveYear.id,
            year_start: oldActiveYear.year_start,
            year_end: oldActiveYear.year_end,
          })
        : null,
      new_value: JSON.stringify({
        id: newActiveYear[0]?.id,
        year_start: newActiveYear[0]?.year_start,
        year_end: newActiveYear[0]?.year_end,
      }),
    });

    res.json({ message: "School year activated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveYear = async (req, res) => {
  try {
    const year = await schoolYearModel.getActiveSchoolYear();
    res.json(year);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSchoolYears,
  getSchoolYearsFull,
  createYear,
  updateYear,
  deleteYear,
  activateYear,
  getActiveYear,
};
