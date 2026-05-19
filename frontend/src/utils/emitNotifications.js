// utils/emitNotification.js

import { socketManager } from "./socket";

export const emitNotification = ({
    recipient,
    type,
    title,
    message,
    link,
    meta = {},
}) => {
    socketManager.emitMessage("create_notification", {
        recipient,
        type,
        title,
        message,
        link,
        meta,
    });
};