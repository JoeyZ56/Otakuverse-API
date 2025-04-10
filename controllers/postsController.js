const Post = require("../models/Post");
const ConnectDB = require("../libs/db");

//GET
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    await ConnectDB();

    const post = await Post.findById(id);

    res.status(200).json(post);
  } catch (err) {
    console.error("Failed to GET post:", err);
    res.status(500).send("Database Error");
  }
};

//Delete
const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    await ConnectDB();

    await Post.findByIdAndDelete(id);

    res.status(200).send("Post has been deleted");
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).send("Database Error");
  }
};

module.exports = { getPostById, deletePostById };
