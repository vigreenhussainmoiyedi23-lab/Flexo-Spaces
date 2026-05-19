const imagekit = require("../config/imagekit");
const chatModel = require("../models/chats/chat.model");
const messageModel = require("../models/chats/message.model");
const { createMessageFromSocket } = require("../services/chat/socket.services");
const { deleteImageFromListing } = require("../services/listing/DeleteImage.service");

const chatSockets = (io, socket, socketUserMap) => {

    socket.on("createMessage", async (data) => {
        try {
            const senderId = socket.userId; // from auth middleware
            const newMessage = await createMessageFromSocket({
                ...data,
                senderId,
            });
            const chat = await chatModel.findById(data.chatId)
            chat.lastMessage = newMessage._id
            chat.lastMessageAt = Date.now()
            await chat.save()
            io.to(data.chatId).emit("message", newMessage);

        } catch (err) {
            console.log(err);
        }
    });
    socket.on("updateMessage", async (data) => {
        try {
            const chat = await chatModel.findById(data.chatId);
            const senderId = socket.userId; // from auth middleware
            if (!chat.participants.includes(senderId)) {
                return;
            }
            const message = await messageModel.findById(data.messageId);

            if (!message) return;

            if (message.sender.toString() !== senderId.toString()) {
                return; // ❌ unauthorized
            }
            const EditedMessage = await messageModel.findByIdAndUpdate(data.messageId, {
                isEdited: true,
                text: data.text
            }, { returnDocument: "after" }).populate({ path: "sender", select: "username profilePicture email" });

            io.to(data.chatId).emit("messageEdited", EditedMessage);
            await chat.save()
        } catch (err) {
            console.log(err);
        }
    });
    socket.on("deleteMessage", async (data) => {
        try {
            const chat = await chatModel.findById(data.chatId);

            const senderId = socket.userId; // from auth middleware
            if (!chat.participants.includes(senderId)) {
                return;
            }
            const message = await messageModel.findById(data.messageId);

            if (!message) return;

            if (message.sender.toString() !== senderId.toString()) {
                return; // ❌ unauthorized
            }
            const deletedMessage = await messageModel.findByIdAndUpdate(data.messageId, {
                isDeleted: true,
                text: "",
                images: []
            }, { returnDocument: "after" }).populate({ path: "sender", select: "username profilePicture email" });
            const { images } = message

            if (images.length > 0) {
                const fileIds = images.map(img => img.fileId)
                // Delete the image from ImageKit
                await imagekit.files.bulk.delete({ fileIds: fileIds });
            }

            await chat.save()
            io.to(data.chatId).emit("messageDeleted", deletedMessage);

        } catch (err) {
            console.log(err);
        }
    });

    socket.on("typing", (data) => {
        socket.to(data.chatId).emit("typing", data);
    });

    socket.on("stop_typing", (data) => {
        socket.to(data.chatId).emit("stop_typing", data);
    });
    socket.on("join_room", (chatId) => {
        socket.join(chatId.toString());
    });
    socket.on("leave_room", (chatId) => {
        socket.join(chatId.toString());
    });
}

module.exports = { chatSockets }