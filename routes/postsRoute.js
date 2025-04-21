const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  deletePostById,
} = require("../controllers/postsController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

router.post("/", verifyToken, upload.single("img"), (req, res) => {
  console.log("Reached /api/post route");
  createPost(req, res);
});

router.get("/", getAllPosts);

router.get("/user/posts", verifyToken, getUserPosts);

router.get("/:id", getPostById);

router.delete("/:id", verifyToken, deletePostById);

module.exports = router;
