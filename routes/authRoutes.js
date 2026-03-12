const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

//update
router.put("/users/:id", authController.updateUserController);

// view users
router.get("/users", authController.getUserControllers);

// create user
router.post("/users", authController.createUserController);

// update status
router.put("/users/:id/status", authController.updateUserStatusController);

// login
router.post("/login", authController.getUserLoginControllers);

// logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("sms-session");

    res.json({ message: "Logged out successfully" });
  });
});

// session check
router.get("/me", checkAuth, (req, res) => {
  res.json({
    user: req.session.user,
  });
});

module.exports = router;
