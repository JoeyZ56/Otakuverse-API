const express = require("express");
const router = express.Router();
const { createUser, updateUserById } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", createUser);
router.put("/:id", verifyToken, updateUserById);

module.exports = router;
