const userModels = require("../models/userModel");
const bcrypt = require("bcryptjs");
const logAction = require("../utils/auditLogger");

// =========================
// GET USERS
// =========================
async function getUserControllers(req, res) {
  console.log("📥 GET USERS REQUEST");

  try {
    const response = await userModels.getUsers();
    console.log("📊 USERS RESULT:", response.length);

    res.json(response);
  } catch (err) {
    console.error("💥 GET USERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

// =========================
// LOGIN
// =========================
async function getUserLoginControllers(req, res) {
  console.log("🔥 LOGIN REQUEST RECEIVED");
  console.log("📥 BODY:", req.body);

  try {
    const { school_id, password } = req.body;

    console.log("🔍 Fetching user with school_id:", school_id);

    const response = await userModels.getLogin(school_id);

    console.log("📊 Query result:", response);

    if (!response || response.length === 0) {
      console.log("❌ No user found");
      return res.status(401).json({
        message: "Invalid school ID or password",
      });
    }

    const user = response[0];

    console.log("👤 User found:", user);

    let firstName = null;
    let lastName = null;
    let profile_photo = null;

    if (user.role === "student") {
      firstName = user.student_first_name;
      lastName = user.student_last_name;
      profile_photo = user.student_photo;
    }

    if (user.role === "teacher") {
      firstName = user.teacher_first_name;
      lastName = user.teacher_last_name;
      profile_photo = user.teacher_photo;
    }

    console.log("🔑 Comparing password...");

    const match = await bcrypt.compare(password, user.password);

    console.log("✅ Password match:", match);

    if (!match) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        message: "Invalid school ID or password",
      });
    }

    console.log("🍪 Creating session...");

    req.session.user = {
      id: user.id,
      school_id: user.school_id,
      role: user.role,
    };

    console.log("✅ Session created:", req.session.user);

    // =========================
    // SAFE AUDIT LOG (WON'T CRASH)
    // =========================
    try {
      console.log("📝 Logging login action...");

      await logAction({
        user_id: user.id,
        action: "LOGIN",
        table_name: "users",
        record_id: user.id,
        old_value: null,
        new_value: JSON.stringify({
          school_id: user.school_id,
          role: user.role,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log("✅ Audit log success");
    } catch (logErr) {
      console.error("❌ AUDIT LOG ERROR:", logErr);
    }

    console.log("🎉 LOGIN SUCCESS");

    res.json({
      message: "Login success",
      user: {
        id: user.id,
        school_id: user.school_id,
        role: user.role,
        firstName,
        lastName,
        profile_photo,
      },
    });
  } catch (err) {
    console.error("💥 LOGIN CONTROLLER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

// =========================
// CREATE USER
// =========================
async function createUserController(req, res) {
  console.log("📥 CREATE USER REQUEST:", req.body);

  try {
    const { school_id, password, role } = req.body;

    const exists = await userModels.checkSchoolIdExists(school_id);

    if (exists) {
      console.log("❌ School ID already exists");
      return res.status(400).json({
        message: "School ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModels.createUser(school_id, hashedPassword, role);

    // SAFE LOG
    try {
      await logAction({
        user_id: req.session?.user?.id || null,
        action: "CREATE_USER",
        table_name: "users",
        record_id: result.insertId,
        old_value: null,
        new_value: JSON.stringify({ school_id, role }),
      });
    } catch (logErr) {
      console.error("❌ AUDIT LOG ERROR:", logErr);
    }

    console.log("✅ User created:", result.insertId);

    res.json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("💥 CREATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

// =========================
// UPDATE USER STATUS
// =========================
async function updateUserStatusController(req, res) {
  console.log("📥 UPDATE STATUS REQUEST:", req.params, req.body);

  try {
    const id = req.params.id;
    const { status } = req.body;

    const [users] = await userModels.getUserById(id);
    const oldStatus = users ? users.status : null;

    await userModels.updateUserStatus(id, status);

    try {
      await logAction({
        user_id: req.session?.user?.id,
        action: "UPDATE_USER_STATUS",
        table_name: "users",
        record_id: id,
        old_value: oldStatus,
        new_value: status,
      });
    } catch (logErr) {
      console.error("❌ AUDIT LOG ERROR:", logErr);
    }

    console.log("✅ Status updated:", id);

    res.json({
      message: "User status updated",
    });
  } catch (err) {
    console.error("💥 UPDATE STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

// =========================
// UPDATE USER
// =========================
async function updateUserController(req, res) {
  console.log("📥 UPDATE USER REQUEST:", req.params, req.body);

  try {
    const id = req.params.id;
    const { school_id, role } = req.body;

    const [users] = await userModels.getUserById(id);

    const oldValues = users
      ? { school_id: users.school_id, role: users.role }
      : null;

    const exists = await userModels.checkSchoolIdExists(school_id);

    if (exists && users?.school_id !== school_id) {
      console.log("❌ School ID already exists");
      return res.status(400).json({
        message: "School ID already exists",
      });
    }

    await userModels.updateUser(id, school_id, role);

    try {
      await logAction({
        user_id: req.session?.user?.id,
        action: "UPDATE_USER",
        table_name: "users",
        record_id: id,
        old_value: JSON.stringify(oldValues),
        new_value: JSON.stringify({ school_id, role }),
      });
    } catch (logErr) {
      console.error("❌ AUDIT LOG ERROR:", logErr);
    }

    console.log("✅ User updated:", id);

    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("💥 UPDATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUserControllers,
  getUserLoginControllers,
  createUserController,
  updateUserStatusController,
  updateUserController,
};
