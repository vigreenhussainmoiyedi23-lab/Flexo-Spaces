const mongoose = require("mongoose")
const chatModel = require("../models/chats/chat.model")
const messageModel = require("../models/chats/message.model")


async function getChatAllMessagesHandler(req, res) {
    const { chatId } = req.params
    const { skip, limit } = req.query
    const messages = await messageModel.find({ chatId: chatId }).skip(skip).limit(limit).populate({ path: "sender", select: "username profilePicture email" });
    res.status(200).json({ messages, message: "Messages fetched successfully", success: true });
}
async function getUserAllChatsHandler(req, res) {
    const userId = req.userId
    const chats = await chatModel.find({ participants: userId }).populate([
        {
            path: "participants",
            select: "username profilePicture email"
        }, {
            path: "lastMessage",
        }]
    ).lean()
    const chatsWithOtherUserName = chats.map(c => {
        const otherUser = c.participants.find(p => p._id.toString() !== userId.toString())
        return { ...c, otherUser }
    })
    res.status(200).json({ chats: chatsWithOtherUserName, message: "Chats fetched successfully", success: true });
}

async function chatAccessHandler(req, res) {
    const currentUser = req.userId
    const { otherUser } = req.body
    const isValid = mongoose.Types.ObjectId.isValid(otherUser);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid user ID", success: false });
    }
    let chat
    chat = await chatModel.findOne({ participants: { $all: [currentUser, otherUser] } })
    if (!chat) {
        chat = await chatModel.create({ participants: [currentUser, otherUser] })
    }
    res.status(200).json({ chatId: chat._id, message: "Chat found", success: true });
}

module.exports = {
    getChatAllMessagesHandler,
    getUserAllChatsHandler,
    chatAccessHandler
}