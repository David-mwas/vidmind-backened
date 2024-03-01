// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "system"],
    default: "user",
  },
  // Other user fields such as email, password, etc.
});

module.exports = mongoose.model("User", userSchema);
