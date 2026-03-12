const dashboardModel = require("../models/dashboardModel");

/* ======================================================
MAIN DASHBOARD DATA
====================================================== */

const getDashboard = async (req, res) => {
  try {
    const data = await dashboardModel.getDashboardStats();

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
STUDENT ATTENDANCE CHART
====================================================== */

const getStudentAttendanceChart = async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const data = await dashboardModel.getStudentAttendanceStats(user_id);

    res.json(data);
  } catch (error) {
    console.error("Student attendance error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ======================================================
SYSTEM ATTENDANCE CHART
====================================================== */

const getAttendanceChart = async (req, res) => {
  try {
    const data = await dashboardModel.getAttendanceChart();

    res.json(data);
  } catch (error) {
    console.error("Attendance chart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboard,
  getStudentAttendanceChart,
  getAttendanceChart,
};
