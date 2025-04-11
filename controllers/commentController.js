const Comments = require("../models/Comments");
const ConnectDB = require("../libs/db");

// POST Create Comment (Token Protected)
const createComment = async (req, res) => {
  const { postId, text } = req.body;
  const { id: userId, email } = req.user;

  try {
    await ConnectDB();

    const newComment = new Comments({
      postId,
      text,
      author: userId, // tie it to the logged-in user
      username: email, // optional, for display
    });

    await newComment.save();

    res.status(201).send("Comment has been created");
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Database Error");
  }
};

// GET Comments (Public)
const getComments = async (req, res) => {
  const { postId, username } = req.query;

  try {
    await ConnectDB();

    const query = {};
    if (postId) query.postId = postId;
    if (username) query.username = username;

    const comments = await Comments.find(query);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Failed to get comments:", error);
    res.status(500).send("Cannot find comments");
  }
};

//Delete Comment (Token Protected)
const deleteComment = async (req, res) => {
  const { id } = req.params; // comment ID
  const { id: userId } = req.user; // user ID from token

  try {
    await ConnectDB();

    const comment = await Comments.findById(id);
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Check if the logged-in user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).send("Not authorized to delete this comment");
    }

    await comment.deleteOne();

    res.status(200).send("Comment deleted");
  } catch (err) {
    console.error("Failed to delete comment:", err);
    res.status(500).send("Database Error");
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
