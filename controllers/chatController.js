// controllers/chatController.js
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/Message");
const Video = require("../models/video");

// Get all chat sessions
exports.getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId " + userId);
    // Check if both user and model exist
    const user = await User.findById(userId);
    console.log(user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const chats = await Chat.find({ user: user._id });
    if (!chats) {
      return res.status(404).json({ message: "Chats not found" });
    }
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new chat session
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body; // Assume videoData comes from the request body

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new chat session
    const newChat = new Chat({
      user: userId,
    });

    // Create a new video document
    const newVideo = new Video(); // videoData should match your Video schema

    // Save the video document
    await newVideo.save();

    // Associate the video with the chat session (if needed)
    // newChat.video = newVideo._id; // Assuming the Chat model has a reference to Video

    await newChat.save();
    // res.status(201).json({ chat: newChat, video: newVideo });
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new chat session
// exports.createChat = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Check if both user and model exist
//     const user = await User.findById(userId);
//     console.log(user);
//     console.log(userId);

//     // Create a new chat session
//     const newChat = new Chat({
//       user: userId,
//     });

//     await newChat.save();
//     res.status(201).json(newChat);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const video = await Video.findById(chat?.video?.toHexString());

    const messagePromises = chat.messages.map(async (item) => {
      const mess = await Message.findById(item?.toHexString());
      return mess;
    });

    let messages = await Promise.all(messagePromises);

    // Sort messages by timestamp in descending order
    messages = messages.sort((a, b) => a.timestamp - b.timestamp);

    const response = {
      message: messages,
      video: video,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a specific chat session by its ID
// exports.getChatById = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }
//     const video = await Video.findById(chat?.video?.toHexString());

//     const messagePromises = chat.messages.map(async (item) => {
//       const mess = await Message.findById(item?.toHexString());
//       return mess;
//     });

//     const messages = await Promise.all(messagePromises);
//     const response = {
//       message: messages,
//       video: video,
//     };
//     res.status(200).json(response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// Add a new message to a chat session






exports.createMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;

    console.log(role, content); // Check what values are received

    // Validate inputs
    if (!role || !content) {
      return res
        .status(400)
        .json({ message: "Role and content are required." });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = new Message({
      role,
      content,
      chat: chat._id,
    });
    await message.save();

    chat.messages.push(message);
    await chat.save();

    res
      .status(201)
      .json({ message: "Message created successfully", data: message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.createMessage = async (req, res) => {
//   try {
//     const { id } = req.params; // Get chat session ID from URL params
//     const { role, content } = req.body; // Get message data from request body
//     console.log(role, content);
//     // Find the chat session by ID
//     const chat = await Chat.findById(id);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // Create the message and associate it with the chat session
//     const message = new Message({
//       role,
//       content,
//       chat: chat._id, // Associate message with chat session
//     });
//     await message.save();

//     // Add the message to the chat session's messages array
//     chat.messages.push(message);
//     await chat.save();

//     res
//       .status(201)
//       .json({ message: "Message created successfully", data: message });
//   } catch (error) {
//     console.error("Error creating message:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// delete chat by id

exports.deleteChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    chat.deleteOne();
    // Chat.de
    await chat.save();
    res.status(201).json({ message: "Chat Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
