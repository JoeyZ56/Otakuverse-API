const Post = require("../models/Post");
const ConnectDB = require("../libs/db");

//Get Posts (Public)
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

//POST Create Post (Token Protected)
const createPost = async (req, res) => {
  const { title, content, img } = req.body;
  const { id: userId, name, profileImage } = req.user;

  try {
    await ConnectDB();

    const newPost = new Post({
      author: userId,
      title,
      content,
      img,
      username: name, // Snapshot for display
      profileImage: profileImage || "", // Optional
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).send("Database Error");
  }
};

//Delete Posts (Token protected)
const deletePostById = async (req, res) => {
  const { id } = req.params; // post ID
  const { id: userId } = req.user; // user ID from JWT

  try {
    await ConnectDB();

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Ownership check
    if (post.author.toString() !== userId) {
      return res.status(403).send("Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(id);

    res.status(200).send("Post has been deleted");
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).send("Database Error");
  }
};

module.exports = { getPostById, deletePostById };
