const enrollmentRequestModel = require("../models/enrollmentRequestModel");
const logAction = require("../utils/auditLogger");

async function getAllRequests(req, res) {
  try {
    const { school_year_id } = req.query;

    const data = await enrollmentRequestModel.getAllRequests(school_year_id);

    res.json(data);
  } catch (error) {
    console.error("GET REQUEST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createRequest(req, res) {
  try {
    const data = req.body;

    const result = await enrollmentRequestModel.createRequest(data);

    // LOG CREATE ENROLLMENT REQUEST
    await logAction({
      user_id: req.session?.user?.id || null,
      action: "CREATE_ENROLLMENT_REQUEST",
      table_name: "enrollment_requests",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({
        student_id: data.student_id,
        class_id: data.class_id,
        school_year_id: data.school_year_id,
        status: "pending",
      }),
    });

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

    // Get request details before approval for logging
    const [requestDetails] = await enrollmentRequestModel.getRequestById(id);

    await enrollmentRequestModel.approveRequest(id);

    // LOG APPROVE ENROLLMENT REQUEST
    await logAction({
      user_id: req.session.user.id,
      action: "APPROVE_ENROLLMENT_REQUEST",
      table_name: "enrollment_requests",
      record_id: id,
      old_value: JSON.stringify({
        status: "pending",
        student_id: requestDetails?.student_id,
        class_id: requestDetails?.class_id,
        school_year_id: requestDetails?.school_year_id,
      }),
      new_value: JSON.stringify({
        status: "approved",
        ...requestDetails,
      }),
    });

    res.json({
      message: "Enrollment approved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function rejectRequest(req, res) {
  try {
    const id = req.params.id;

    // Get request details before rejection for logging
    const [requestDetails] = await enrollmentRequestModel.getRequestById(id);
    const oldStatus = requestDetails?.status;

    await enrollmentRequestModel.rejectRequest(id);

    // LOG REJECT ENROLLMENT REQUEST
    await logAction({
      user_id: req.session.user.id,
      action: "REJECT_ENROLLMENT_REQUEST",
      table_name: "enrollment_requests",
      record_id: id,
      old_value: oldStatus,
      new_value: "rejected",
    });

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
