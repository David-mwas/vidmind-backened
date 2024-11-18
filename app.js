require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const userRoutes = require("./Routes/user");
const chatRoutes = require("./Routes/Chats");
const Chat = require("./models/chat");
const { addVideoToMongoDB } = require("./utils/addVideoToAstra");
const { addChatGPTresponse } = require("./utils/gemini");
// const {initMongooseVideoModel} =require("./models/astradb-mongoose")
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.mongoDB_URI, {
  dbName: process.env.mongoDbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
// connectToAstraDb()
// initMongooseVideoModel();
// Middleware
//localhost:5173
//vidmind.vercel.app/
app.use(
  cors({
    origin: "https://vidmind.vercel.app", // Use the exact URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);
app.options("*", cors());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// Routes
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Video POST route
app.post("/videos/:id", async (req, res) => {
  const urlAddress = req.body.urlAddress;
  if (!urlAddress) {
    return res.status(400).json({ Error: "No URL provided" });
  }

  const youtubeUrlRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const url = urlAddress.trim();
  if (!youtubeUrlRegex.test(url)) {
    return res.status(400).json({ Error: "Invalid YouTube URL" });
  }

  try {
    const video = await addVideoToMongoDB(urlAddress);
    // console.log(
    //   `line 70 req.body?.messages ${req.body?.messages.map((m) => m)}`
    // );
    const messages = await addChatGPTresponse({
      video: video,
      messages: req.body?.messages || [],
      prompt: req.body?.prompt,
    });
    console.log("Messages", messages);
    if (messages) {
      var latestMessage = messages[messages?.length - 1] || "New chat";
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params?.id },
      {
        $set: {
          video: video?._id,
          title: latestMessage?.content?.slice(20, 43),
        },
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await chat.save();
    // console.log("Chat updated successfully");

    return res.status(200).json({ video, messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(process.env.frontendUrl);
  console.log(`Server listening at http://localhost:${port}`);
});
