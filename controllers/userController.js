const User = require("../models/User");
const Bio = require("../models/Bio");
const ConnectDB = require("../libs/db");

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

// GET bio (public)
const getBio = async (req, res) => {
  try {
    await ConnectDB();
    const email = decodeURIComponent(req.query.email);
    const bio = await Bio.findOne({ email });

    if (!bio) {
      return res.status(404).send("Bio not found");
    }

    res.status(200).json(bio);
  } catch (error) {
    console.error("GET Database Error:", error);
    res.status(500).send("Database Error");
  }
};

// POST create/update bio (Token protected)
const createOrUpdateBio = async (req, res) => {
  const { bio } = req.body;
  const { email } = req.user;

  if (!email || !bio) {
    return res.status(400).json({ error: "Email and bio are required" });
  }

  try {
    await ConnectDB();

    const updatedBio = await Bio.findOneAndUpdate(
      { email },
      { $set: { bio } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Bio updated successfully",
      bio: updatedBio,
    });
  } catch (error) {
    console.error("POST Database Error:", error);
    res.status(500).json({ error: "Database error, unable to update bio" });
  }
};

// PUT bio (Token protected)
const updateBio = async (req, res) => {
  const { bio } = req.body;
  const { email } = req.user;

  try {
    await ConnectDB();

    const updatedBio = await Bio.findOneAndUpdate(
      { email },
      { bio },
      { new: true }
    );

    if (!updatedBio) {
      return res.status(404).send("Bio not found");
    }

    res.status(200).send("Bio has been updated");
  } catch (error) {
    console.error("PUT Database Error:", error);
    res.status(500).send("Database Error");
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
  updateUserById,
  updateProfileImage,
  getProfileImage,
  getBio,
  createOrUpdateBio,
  updateBio,
  deleteBio,
};
