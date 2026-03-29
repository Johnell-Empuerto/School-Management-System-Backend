const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/authMiddleware");

const {
  getPromotionStudents,
  runPromotion,
  getNextClasses,
} = require("../controllers/promotionController");

router.get("/promotion", checkAuth, getPromotionStudents);

router.post("/promotion/run", checkAuth, runPromotion);

router.get("/next-classes", checkAuth, getNextClasses);

module.exports = router;
