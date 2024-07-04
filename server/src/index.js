const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const Chat = require("./models/chatModel");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoute);
app.use(chatRoute);
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

  socket.on("message", async (data) => {
    try {
      // find an existing chat where the both sender and receiver are the connected users
      const existingChat = await Chat.findOne({
        connectedUsers: {
          $all: [
            { $elemMatch: { email: data.senderEmail } },
            { $elemMatch: { email: data.receiverEmail } },
          ],
        },
      });
      if (existingChat) {
        // if exist then add new messate to the chat
        existingChat.chats.push({
          senderEmail: data.senderEmail,
          message: data.message,
        });
        await existingChat.save();
      } else {
        // if not exist then create new chat document
        const chatData = {
          connectedUsers: [
            { email: data.senderEmail },
            { email: data.receiverEmail },
          ],
          chats: [
            {
              senderEmail: data.senderEmail,
              message: data.message,
            },
          ],
        };
        await Chat.create(chatData);
      }
    } catch (err) {
      console.log(err);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
