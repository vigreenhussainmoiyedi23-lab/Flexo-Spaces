const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chats", required: true },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

  text: { type: String },

  images: [{ url: String, fileId: String }],

  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
messageSchema.index({ chatId: 1 });
const messageModel = mongoose.model("messages", messageSchema, "messages")

module.exports = messageModel