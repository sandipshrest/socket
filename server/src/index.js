const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoute);
require("dotenv").config();

const connection = require("./db/connection");
connection();
const port = process.env.PORT || 5000;

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
