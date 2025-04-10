const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
