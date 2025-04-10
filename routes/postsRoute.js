const express = require("express");
const router = express.Router();
const {
  getPostById,
  deletePostById,
} = require("../controllers/postsController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:id", getPostById);
router.delete("/:id", verifyToken, deletePostById);

module.exports = router;
