const express = require("express");
const router = express.Router();
const {
  getPostById,
  deletePostById,
} = require("../controllers/postsController");

router.get("/:id", getPostById);
router.delete("/:id", deletePostById);

module.exports = router;
