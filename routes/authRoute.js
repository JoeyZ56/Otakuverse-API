const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/authController");
const upload = require("../middleware/multerMiddleware");

router.post("/register", upload.single("profileImage"), (req, res) => {
  console.log("Reached /api/auth route");
  createUser(req, res);
});
router.post("/login", loginUser);

module.exports = router;
