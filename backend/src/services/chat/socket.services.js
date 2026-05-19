const messageModel = require("../../models/chats/message.model")

const createMessageFromSocket = async ({ chatId, message, files, senderId }) => {
    let newMessage = await messageModel.create({
        chatId,
        sender: senderId,
        text: message,
        images: files, // ✅ store URLs
    });
    newMessage = newMessage.populate({ path: "sender", select: "username profilePicture email" });

    return newMessage;
};
const updateMessageFromSocket = async ({ chatId, message, files, senderId }) => {
    const newMessage = await messageModel.create({
        chatId,
        sender: senderId,
        text: message,
        images: files, // ✅ store URLs
    });

    return newMessage;
};

module.exports = { createMessageFromSocket }