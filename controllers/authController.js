const userModels = require("../models/userModel");
const bcrypt = require("bcryptjs");

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

    await userModels.createUser(school_id, hashedPassword, role);

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

    await userModels.updateUserStatus(id, status);

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

    const exists = await userModels.checkSchoolIdExists(school_id);

    if (exists) {
      return res.status(400).json({
        message: "School ID already exists",
      });
    }

    await userModels.updateUser(id, school_id, role);

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
