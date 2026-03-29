const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");
const { body, validate } = require("../middleware/validator");
const authController = require("../controllers/authController");

//update
router.put("/users/:id", checkAuth, authController.updateUserController);

// view users
router.get("/users", checkAuth, authController.getUserControllers);

// create user
router.post("/users", checkAuth, authController.createUserController);

// update status
router.put(
  "/users/:id/status",
  checkAuth,
  authController.updateUserStatusController,
);

// login
router.post(
  "/login",
  [
    body("school_id").notEmpty().withMessage("School ID required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  authController.getUserLoginControllers,
);

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
