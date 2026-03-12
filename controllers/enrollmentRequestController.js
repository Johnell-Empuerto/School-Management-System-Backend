const enrollmentRequestModel = require("../models/enrollmentRequestModel");

async function getAllRequests(req, res) {
  try {
    const data = await enrollmentRequestModel.getAllRequests();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createRequest(req, res) {
  try {
    const data = req.body;

    await enrollmentRequestModel.createRequest(data);

    res.json({
      message: "Enrollment request submitted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function approveRequest(req, res) {
  try {
    const id = req.params.id;

    await enrollmentRequestModel.approveRequest(id);

    res.json({
      message: "Enrollment approved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function rejectRequest(req, res) {
  try {
    const id = req.params.id;

    await enrollmentRequestModel.rejectRequest(id);

    res.json({
      message: "Enrollment rejected",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllRequests,
  createRequest,
  approveRequest,
  rejectRequest,
};
