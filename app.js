require("dotenv").config();
const cors = require("cors");
const { addVideoToMongoDB } = require("./utils/addVideoToAstra");
const { addChatGPTresponse } = require("./utils/addChatGPTresponse");
const userRoutes = require("./Routes/user");
const chatRoutes = require("./Routes/Chats");
const Chat = require("./models/chat");
const logger = require("morgan");
// const {
//   connectToAstraDb,
//   initMongooseVideoModel,
// } = require("./astradb-mongoose");
const express = require("express");

// connectToAstraDb();
// initMongooseVideoModel();

// mongodb
const mongoose = require("mongoose");

const uri = process.env.mongoDB_URI;
// mongodb+srv://davidmwas:<password>@cluster0.vdzyeb4.mongodb.net/

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

//routes
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/videos/:id", async (req, res) => {
  const urlAddress = req.body.urlAddress;
  if (!urlAddress) {
    return;
  }
  const chatId = req.params.id;
  console.log(urlAddress);
  const youtubeUrlRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const url = urlAddress?.trim();
  if (youtubeUrlRegex.test(url)) {
    console.log("Valid YouTube URL");

    let messages = req.body.messages || [];
    console.log(`urlAddress: ${urlAddress}`);
    let video = await addVideoToMongoDB(urlAddress);
    console.log(`confirm video from astra ${video}`);
    messages = await addChatGPTresponse(video, messages);
    console.log(video?._id.toString());
    const id = video?._id.toString();
    // console.log(messages);
    try {
      const latestMessage = messages[messages.length - 1];
      const chat = await Chat.findOneAndUpdate(
        { _id: req.params?.id },
        { $set: { video: id, title: latestMessage.content.slice(20, 43) } },
        { new: true }
      );

      if (!chat) {
        console.log("Chat not found");
        return res.status(404).json({ message: "Chat not found" });
      }

      await chat.save();
      console.log("Chat updated successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
    // await Chat.save();
    res.status(200).send({
      video,
      messages,
    });
  } else {
    console.log("Not a valid YouTube URL");
    res.status(400).send({
      Error: "Invalid youtube url",
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
