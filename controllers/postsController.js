const Post = require("../models/Post");
const User = require("../models/User");
const ConnectDB = require("../libs/db");

//POST Create Post (Token Protected)
const createPost = async (req, res) => {
  try {
    await ConnectDB();

    const { title, content, excerpt } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!req.file) {
      return res.status(400).send("Image file required");
    }

    const newPost = new Post({
      title,
      excerpt,
      content,
      author: user._id,
      username: user.name,
      profileImage: user.profileImage?.data
        ? {
            data: user.profileImage.data,
            contentType: user.profileImage.contentType,
          }
        : undefined,
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

//Get All posts (public)
const getAllPosts = async (req, res) => {
  try {
    await ConnectDB();

    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to GET ALL posts:", err);
    res.status(500).send("Database Error");
  }
};

//Get Post By Id (Public)
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

module.exports = { createPost, getAllPosts, getPostById, deletePostById };
