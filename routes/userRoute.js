const express = require("express");
const router = express.Router();
const {
  updateUserById,
  updateProfileImage,
  getProfileImage,
  getBio,
  updateBio,
  deleteBio,
  getUserById,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// User Account Info
router.get("/account/:id", getUserById);
router.put("/account", verifyToken, updateUserById);

// User Profile Image
router.get("/account/profile-image", getProfileImage);
router.put("/account/profile-image", verifyToken, updateProfileImage);

// USer Bio
router.get("/account/bio", verifyToken, getBio);
router.put("/account/bio/save", verifyToken, updateBio);
router.delete("/account/bio/delete", verifyToken, deleteBio);

module.exports = router;
