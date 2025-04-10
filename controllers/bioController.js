const Bio = require("../models/Bio");
const ConnectDB = require("../libs/db");

// GET /api/bio?email=someone@example.com
const getBio = async (req, res) => {
  try {
    await ConnectDB();
    const userEmail = decodeURIComponent(req.query.email);

    console.log("Searching for bio with email:", userEmail);
    const bio = await Bio.findOne({ email: userEmail });

    if (!bio) {
      return res.status(404).send("Bio not found");
    }

    res.status(200).json(bio);
  } catch (error) {
    console.error("GET Database Error:", error);
    res.status(500).send("Database Error");
  }
};

// POST /api/bio (create or update)
const createOrUpdateBio = async (req, res) => {
  const { email, bio } = req.body;

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

// PUT /api/bio (update existing bio)
const updateBio = async (req, res) => {
  const body = req.body;

  try {
    await ConnectDB();

    const updatedBio = await Bio.findOneAndUpdate({ email: body.email }, body, {
      new: true,
    });

    if (!updatedBio) {
      return res.status(404).send("Bio not found");
    }

    console.log("Bio updated:", updatedBio);
    res.status(200).send("Bio has been updated");
  } catch (error) {
    console.error("PUT Database Error:", error);
    res.status(500).send("Database Error");
  }
};

// DELETE /api/bio (delete bio by email)
const deleteBio = async (req, res) => {
  const body = req.body;

  try {
    await ConnectDB();

    const deletedBio = await Bio.findOneAndDelete({ email: body.email });
    if (!deletedBio) {
      return res.status(404).send("Bio not found");
    }

    console.log("Bio deleted:", deletedBio);
    res.status(200).send("Bio has been deleted");
  } catch (error) {
    console.error("DELETE Database Error:", error);
    res.status(500).send("Database Error");
  }
};

module.exports = {
  getBio,
  createOrUpdateBio,
  updateBio,
  deleteBio,
};
