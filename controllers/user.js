// controllers/userController.js
const User = require("../models/user");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, role } = req.body;
    console.log(username, role);
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "Username already exists", existingUser });
    }

    // Create a new user with the provided username
    const newUser = new User({
      username,
      role,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
