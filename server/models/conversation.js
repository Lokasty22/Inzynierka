const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
  deletedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isDeleted: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Conversation", conversationSchema);
