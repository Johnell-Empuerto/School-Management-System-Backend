const schoolYearModel = require("../models/schoolYearModel");

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
  const { year_start, year_end } = req.body;

  await schoolYearModel.createSchoolYear(year_start, year_end);

  res.json({ message: "School year created" });
};

const updateYear = async (req, res) => {
  const { id } = req.params;
  const { year_start, year_end } = req.body;

  await schoolYearModel.updateSchoolYear(id, year_start, year_end);

  res.json({ message: "School year updated" });
};

const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;

    await schoolYearModel.deleteSchoolYear(id);

    res.json({ message: "School year deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const activateYear = async (req, res) => {
  const { id } = req.params;

  await schoolYearModel.activateSchoolYear(id);

  res.json({ message: "School year activated" });
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
