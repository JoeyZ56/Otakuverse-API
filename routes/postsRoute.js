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

router.post("/test-upload", upload.single("img"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }

  console.log("Test upload successful:", {
    filename: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
  });

  res.status(200).json({ message: "Image uploaded successfully" });
});

// DRY and clear setup just like the debug one
router.post("/", verifyToken, upload.single("img"), (req, res) => {
  console.log("Reached /api/post route");
  createPost(req, res);
});

router.delete("/:id", verifyToken, deletePostById);

module.exports = router;
