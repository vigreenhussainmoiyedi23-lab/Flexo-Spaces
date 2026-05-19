const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "users" }
    ],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages"
    },
    lastMessageAt: {
        type: Date
    },

    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }

}, { timestamps: true });


const chatModel = mongoose.model("chats", chatSchema, "chats")

module.exports = chatModel