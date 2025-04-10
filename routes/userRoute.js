const express = require("express");
const router = express.Router();
const {
  updateUserById,
  updateProfileImage,
  getProfileImage,
  getBio,
  createOrUpdateBio,
  updateBio,
  deleteBio,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// User Account Info
router.put("/account/", verifyToken, updateUserById);

// User Profile Image
router.get("/account/profile-image", getProfileImage);
router.put("/account/profile-image", verifyToken, updateProfileImage);

// USer Bio
router.get("/account/bio", getBio);
router.post("/account/bio", verifyToken, createOrUpdateBio);
router.put("/account/bio", verifyToken, updateBio);
router.delete("/account/bio", verifyToken, deleteBio);

module.exports = router;
