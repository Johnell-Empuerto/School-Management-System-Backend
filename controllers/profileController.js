const profileModel = require("../models/profileModel");

async function getProfile(req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.session.user.id;
    const role = req.session.user.role;

    const data = await profileModel.getProfile(userId, role);

    res.json(data[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
}

async function getStudentGrades(req, res) {
  try {
    const userId = req.session.user.id;

    const data = await profileModel.getStudentGrades(userId);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
}

async function getStudentAttendance(req, res) {
  try {
    const userId = req.session.user.id;

    const data = await profileModel.getStudentAttendanceSummary(userId);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error" });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.session.user.id;
    const role = req.session.user.role;

    const data = req.body;

    await profileModel.updateProfile(userId, role, data);

    res.json({ message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getProfile,
  getStudentGrades,
  getStudentAttendance,
  updateProfile,
};
