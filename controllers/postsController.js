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
  console.log("createPost controller hit");
  try {
    await ConnectDB();

    const { title, content, excerpt } = req.body;
    const { id: userId, name, profileImage } = req.user;

    if (!req.file) {
      return res.status(400).send("Image file required");
    }

    const newPost = new Post({
      title,
      excerpt,
      content,
      author: userId,
      username: name,
      profileImage: profileImage || "",
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const savedPost = await newPost.save();
    console.log(savedPost);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost._id,
    });
  } catch (err) {
    console.error("Error saving post to DB:", err);
    res.status(500).send("Database save fail");
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

module.exports = { createPost, getPostById, deletePostById };
