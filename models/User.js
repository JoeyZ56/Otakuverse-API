const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
