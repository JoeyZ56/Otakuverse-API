const User = require("../models/User");
const ConnectDB = require("../libs/db");

//POST
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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = { loginUser };
