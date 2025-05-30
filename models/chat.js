// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideoDB",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
