require("dotenv").config()

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app.js");
const connectDB = require("./src/config/database.js");
const { getDataFromToken } = require("./src/utils/jsonwebtoken.js");
const userModel = require("./src/models/user/user.model.js");
const { initSocket } = require("./src/sockets/initialize.js");
const PORT = process.env.PORT || 3000;

connectDB();
const httpServer = createServer(app);

initSocket(httpServer)
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});