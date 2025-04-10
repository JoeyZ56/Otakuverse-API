const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    throw new Error("failed to connect to the database");
  }
};

module.exports = ConnectDB;
