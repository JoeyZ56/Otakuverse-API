const User = require("../models/User");
const ConnectDB = require("../libs/db");

// GET /api/profile-image?email=someone@example.com
const getProfileImage = async (req, res) => {
  const { email } = req.query;

  try {
    await ConnectDB();

    const user = await User.findOne({ email: decodeURIComponent(email) });
    console.log("Fetched user:", user);

    if (user && user.profileImage) {
      return res.status(200).json({ profileImage: user.profileImage });
    }

    res.status(404).json({ message: "Profile image not found" });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Error fetching profile image" });
  }
};

// PUT /api/profile-image
const updateProfileImage = async (req, res) => {
  const { email, profileImage } = req.body;

  try {
    await ConnectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email },
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

module.exports = {
  getProfileImage,
  updateProfileImage,
};
