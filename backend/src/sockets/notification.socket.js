const imagekit = require("../config/imagekit");
const notificationModel = require("../models/user/notification.model");

const notificationSockets = (io, socket, socketUserMap) => {

    // 🔥 Join user personal room
    socket.on("join_notification_room", () => {
        socket.join(socket.userId.toString());
    });

    // 🔥 Create notification (GLOBAL ENTRY POINT)
    socket.on("create_notification", async (data) => {
        try {
            if (!data?.recipient || !data?.type || !data?.title) {
                return;
            }
            const notification = await notificationModel.create({
                recipient: data.recipient,
                sender: socket.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                link: data.link,
                meta: data.meta || {},
            });

            // 🔥 Emit to that user only
            io.to(data.recipient.toString()).emit("new_notification", notification);

        } catch (err) {
            console.log("Notification Error:", err);
        }
    });

    // ✅ Mark single as read
    socket.on("mark_as_read", async ({ notificationId }) => {
        try {
            const notification = await notificationModel.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );

            io.to(socket.userId.toString()).emit("notification_updated", notification);

        } catch (err) {
            console.log(err);
        }
    });

    // ✅ Mark all as read
    socket.on("mark_all_as_read", async () => {
        try {
            await notificationModel.updateMany(
                { recipient: socket.userId, isRead: false },
                { isRead: true }
            );

            io.to(socket.userId.toString()).emit("all_notifications_read");

        } catch (err) {
            console.log(err);
        }
    });

}

module.exports = { notificationSockets }