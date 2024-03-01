// routes/userRoutes.js
const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user");

// Define user routes
userRouter.post("/create", userController.createUser);

module.exports = userRouter;
