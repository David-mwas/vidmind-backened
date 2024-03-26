// routes/chatRoutes.js
const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");

// Define chat routes
chatRouter.get("/:userId/getall", chatController.getAllChats);
chatRouter.post("/create", chatController.createChat);
chatRouter.get("/:id/getchatbyid", chatController.getChatById);
// create a message
chatRouter.post("/:id/messages", chatController.createMessage);
// delete chat
chatRouter.post("/delete/:id", chatController.deleteChatById);

module.exports = chatRouter;
