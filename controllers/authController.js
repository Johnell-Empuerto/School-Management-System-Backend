const userModels = require("../models/userModel");
const bcrypt = require("bcryptjs");
const logAction = require("../utils/auditLogger");

// EXISTING
async function getUserControllers(req, res) {
  try {
    const response = await userModels.getUsers();
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// EXISTING LOGIN
async function getUserLoginControllers(req, res) {
  try {
    const { school_id, password } = req.body;

    const response = await userModels.getLogin(school_id);

    if (response.length > 0) {
      const user = response[0];

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

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res
          .status(401)
          .json({ message: "Invalid school ID or password" });
      }

      req.session.user = {
        id: user.id,
        school_id: user.school_id,
        role: user.role,
      };

      // LOG LOGIN ACTION
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
    } else {
      res.status(401).json({ message: "Invalid school ID or password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// NEW → create user
async function createUserController(req, res) {
  try {
    const { school_id, password, role } = req.body;

    const exists = await userModels.checkSchoolIdExists(school_id);

    if (exists) {
      return res.status(400).json({
        message: "School ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModels.createUser(school_id, hashedPassword, role);

    // LOG CREATE USER ACTION
    await logAction({
      user_id: req.session?.user?.id || null, // System action if no user session
      action: "CREATE_USER",
      table_name: "users",
      record_id: result.insertId,
      old_value: null,
      new_value: JSON.stringify({ school_id, role }),
    });

    res.json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// NEW → change status
async function updateUserStatusController(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    // Get old status before update
    const [users] = await userModels.getUserById(id);
    const oldStatus = users ? users.status : null;

    await userModels.updateUserStatus(id, status);

    // LOG STATUS UPDATE
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_USER_STATUS",
      table_name: "users",
      record_id: id,
      old_value: oldStatus,
      new_value: status,
    });

    res.json({
      message: "User status updated",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUserController(req, res) {
  try {
    const id = req.params.id;
    const { school_id, role } = req.body;

    // Get old values before update
    const [users] = await userModels.getUserById(id);
    const oldValues = users
      ? { school_id: users.school_id, role: users.role }
      : null;

    const exists = await userModels.checkSchoolIdExists(school_id);

    if (exists && users?.school_id !== school_id) {
      return res.status(400).json({
        message: "School ID already exists",
      });
    }

    await userModels.updateUser(id, school_id, role);

    // LOG USER UPDATE
    await logAction({
      user_id: req.session.user.id,
      action: "UPDATE_USER",
      table_name: "users",
      record_id: id,
      old_value: JSON.stringify(oldValues),
      new_value: JSON.stringify({ school_id, role }),
    });

    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
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
