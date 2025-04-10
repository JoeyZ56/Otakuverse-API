const express = require("express");
const router = express.Router();
const {
  getBio,
  createOrUpdateBio,
  updateBio,
  deleteBio,
} = require("../controllers/bioController");

router.get("/", getBio);
router.post("/", createOrUpdateBio);
router.put("/", updateBio);
router.delete("/", deleteBio);

module.exports = router;
