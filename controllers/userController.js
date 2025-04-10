const User = require("../models/User");
const ConnectDB = require("../libs/db");
const bcrypt = require("bcrypt");

//POST
const createUser = async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  try {
    await ConnectDB();

    //Check if user already exists by email and username
    const existingUser = await User.findOne({
      $or: [{ email }, { name }], //$or is a MongoDB query operator - It lets you match any one of multiple conditions
    });

    if (existingUser) {
      return res.status(400).send("Email or Username already in use");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    //Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });

    await newUser.save();

    res.status(201).send("User created Successfully");
  } catch (err) {
    console.error("Failed to create new user:", err);
    res.status(500).send("Database Error");
  }
};

// Update
const updateUserById = async (req, res) => {
  const { name, email, password, profileImage } = req.body;
  const { id } = req.params;

  try {
    await ConnectDB();

    const updatedUser = await User.findOneAndUpdate(
      id,
      {
        name,
        email,
        password,
        profileImage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).send("Database Error");
  }
};

module.exports = { createUser, updateUserById };
