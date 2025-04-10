const Comments = require("../models/Comments");
const ConnectDB = require("../libs/db");

// GET /api/comments?postId=xxx&username=yyy
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

// POST /api/comments
const createComment = async (req, res) => {
  try {
    const commentData = req.body;
    console.log("Received data:", commentData);

    await ConnectDB();

    const newComment = new Comments(commentData);
    await newComment.save();

    console.log("Comment saved:", newComment);
    res.status(201).send("Comment has been created");
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Database Error");
  }
};

//Delete comment
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await ConnectDB();

    const deleted = await Comments.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send("Comment not found");
    }

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
