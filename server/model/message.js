const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    isLink: {
      type: Boolean,
      default: false 
    },
    file: String,
    isRead: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);