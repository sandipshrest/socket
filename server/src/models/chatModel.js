const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  connectedUsers: [{ email: { type: String, required: true } }],
  chats: [
    {
      senderEmail: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }, // Optional: Add a timestamp for each message
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
