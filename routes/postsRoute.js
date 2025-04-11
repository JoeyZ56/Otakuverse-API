const express = require("express");
const router = express.Router();
const {
  getPostById,
  createPost,
  deletePostById,
} = require("../controllers/postsController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

router.get("/:id", getPostById);

// DRY and clear setup just like the debug one
router.post("/", verifyToken, upload.single("img"), (req, res) => {
  console.log("Reached /api/post route");
  createPost(req, res);
});

router.delete("/:id", verifyToken, deletePostById);

module.exports = router;
