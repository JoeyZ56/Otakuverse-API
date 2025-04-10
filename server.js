const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./libs/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Init app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to DB
ConnectDB();

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/comments", require("./routes/commentRoute"));
app.use("/api/post", require("./routes/postsRoute"));
app.use("/api/users", require("./routes/userRoute"));

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
