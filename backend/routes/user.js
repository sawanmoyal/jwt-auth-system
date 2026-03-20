const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getAdminStats,
  toggleUserStatus,
} = require("../controllers/userController");

// User routes (authenticated)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin routes
router.get("/admin/users", protect, authorize("admin"), getAllUsers);
router.get("/admin/stats", protect, authorize("admin"), getAdminStats);
router.patch(
  "/admin/users/:id/toggle",
  protect,
  authorize("admin"),
  toggleUserStatus
);

module.exports = router;
