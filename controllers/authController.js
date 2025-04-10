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

//POST (Logging in a User)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    await ConnectDB();

    //Checks if User exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    //Checks Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Wrong credentials");
    }

    //JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } //User will be logged in for 7 days before having to re-log in
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = { createUser, loginUser };
