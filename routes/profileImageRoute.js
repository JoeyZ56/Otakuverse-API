const express = require("express");
const router = express.Router();
const {
  getProfileImage,
  updateProfileImage,
} = require("../controllers/profileImageController");

router.get("/", getProfileImage);
router.put("/", updateProfileImage);

module.exports = router;
