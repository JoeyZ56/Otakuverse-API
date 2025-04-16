const User = require("../models/User");
const ConnectDB = require("../libs/db");
const { default: mongoose } = require("mongoose");

//USER INFO
//GET USER INFO (Token protected)
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    await ConnectDB();

    const user = await User.findById(id).select("-password"); //exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error finding user by ID:", err);
    res.status(500).send("Server Error");
  }
};

// Update user info (Token protected)
const updateUserById = async (req, res) => {
  const { name, email, password, profileImage } = req.body;
  const { id } = req.user;

  try {
    await ConnectDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, profileImage },
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

//USER IMAGE
// GET profile image (public)
const getProfileImage = async (req, res) => {
  const { email } = req.query;

  try {
    await ConnectDB();

    const user = await User.findOne({ email: decodeURIComponent(email) });

    if (user && user.profileImage) {
      return res.status(200).json({ profileImage: user.profileImage });
    }

    res.status(404).json({ message: "Profile image not found" });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Error fetching profile image" });
  }
};

// PUT profile image (Token protected)
const updateProfileImage = async (req, res) => {
  const { profileImage } = req.body;
  const { id } = req.user;

  try {
    await ConnectDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("Profile Image not found");
    }

    res.status(200).send("Profile Image has been updated");
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).send("Database Error");
  }
};

//USER BIO
// GET bio (public)
const getBio = async (req, res) => {
  console.log("Inside getBio function");
  console.log("User in req:", req.user); // Log the user from the request

  const { _id } = req.user || {}; // Safely get user _id from the JWT payload
  if (!_id) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User ID not found in token" });
  }
  console.log("Decoded user ID from token:", _id); // Log the decoded user _id

  try {
    await ConnectDB();

    // Ensure that _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Query the User model using the _id from the decoded JWT token
    const user = await User.findById(_id).select("bio"); // Only select bio
    console.log("User bio from DB:", user); // Log the user object to verify the bio field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return bio as part of the response
    res.status(200).json({ bio: user.bio });
  } catch (err) {
    console.error("Error fetching bio:", err);
    res.status(500).json({ message: "Server error fetching bio" });
  }
};

// PUT bio (Token protected)
const updateBio = async (req, res) => {
  const { _id } = req.user; // Get user id from JWT
  const { bio } = req.body; // Get new bio from the request body

  console.log("User ID from token:", _id);
  console.log("Updating bio:", bio);

  try {
    await ConnectDB();

    // Ensure that id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "invalid user ID" });
    }
    //Query
    const updateUserBio = await User.findByIdAndUpdate(
      _id,
      { bio },
      { new: true }
    );

    if (!updateUserBio) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User bio has been updated",
      user: updateUserBio,
    });
  } catch (err) {
    console.error("Error updating Bio:", err);
    res.status(500).json({ message: "Database Error" });
  }
};

// DELETE bio (Token protected)
const deleteBio = async (req, res) => {
  const { email } = req.user;

  try {
    await ConnectDB();

    const deletedBio = await Bio.findOneAndDelete({ email });

    if (!deletedBio) {
      return res.status(404).send("Bio not found");
    }

    res.status(200).send("Bio has been deleted");
  } catch (error) {
    console.error("DELETE Database Error:", error);
    res.status(500).send("Database Error");
  }
};

module.exports = {
  getUserById,
  updateUserById,
  updateProfileImage,
  getProfileImage,
  getBio,
  updateBio,
  deleteBio,
};
