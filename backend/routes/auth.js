const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many refresh requests.",
  },
});

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshLimiter, refreshToken);

// Protected routes
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);

module.exports = router;
