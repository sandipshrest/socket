const Chat = require("../models/chatModel");

const getChat = async (req, res) => {
  try {
    const existingChat = await Chat.findOne({
      connectedUsers: {
        $all: [
          { $elemMatch: { email: req.body.senderEmail } },
          { $elemMatch: { email: req.body.receiverEmail } },
        ],
      },
    });
    if (existingChat) {
      res.status(201).json({ existingChat });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getChat };
