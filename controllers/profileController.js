const profileModel = require("../models/profileModel");

// Validate base64 image
function validateBase64Image(base64) {
  if (!base64) return;

  // Ensure it is an image
  if (!base64.startsWith("data:image/")) {
    throw new Error("Invalid image format");
  }

  const base64Data = base64.split(",")[1];

  if (!base64Data) {
    throw new Error("Invalid base64 image");
  }

  const sizeInBytes = Buffer.byteLength(base64Data, "base64");

  const MAX_SIZE = 1024 * 1024; // 1MB

  if (sizeInBytes > MAX_SIZE) {
    throw new Error("Profile image must be less than 1MB");
  }
}

// GET PROFILE
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

// GET STUDENT GRADES
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

// GET ATTENDANCE SUMMARY
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

// UPDATE PROFILE
async function updateProfile(req, res) {
  try {
    const userId = req.session.user.id;
    const role = req.session.user.role;

    const data = req.body;

    // validate profile photo if provided
    if (data.profile_photo) {
      validateBase64Image(data.profile_photo);
    }

    await profileModel.updateProfile(userId, role, data);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message || "Server error",
    });
  }
}

module.exports = {
  getProfile,
  getStudentGrades,
  getStudentAttendance,
  updateProfile,
};
