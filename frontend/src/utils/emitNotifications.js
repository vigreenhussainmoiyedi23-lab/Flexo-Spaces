// utils/emitNotification.js

import { socketManager } from "./socket";

export const emitNotification = ({
    recipient,
    type,
    title,
    message,
    link,
}) => {
    console.log("Emitting notification:", {
        recipient,
        type,
        title,
    })
    socketManager.emitMessage("create_notification", {
        recipient,
        type,
        title,
        message,
        link,
    });
};