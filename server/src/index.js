const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const port = 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client-side origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("name", (name) => {
    console.log("Name received: " + name);
    socket.emit("name", name);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
