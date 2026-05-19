// useChatSocket.js

import { io } from "socket.io-client";
const SOCKETURL=import.meta.env.VITE_SOCKET_URL
class SocketManager {
    constructor() {
        // ✅ state
        this.socket = null;
        this.retryCount = 0;

        // ✅ config
        this.maxRetries = 3;
        this.retryDelay = 3000;

        // ✅ timers
        this.retryTimeout = null;
        this.listeners = new Map();;
    }

    init() {
        if (!this.socket) {
            this.socket = io(SOCKETURL, {
                withCredentials: true,
                autoConnect: false,
                reconnection: false,
            });
        }
        return this.socket;
    }

    connect() {
        const socket = this.init();

        if (socket.connected) return;

        // reset listeners to avoid duplicates
        socket.off("connect");
        socket.off("connect_error");

        socket.connect();

        socket.on("connect", () => {
            this.retryCount = 0; // reset on success
            clearTimeout(this.retryTimeout);

            // join personal notification room for targeted emits
            socket.emit("join_notification_room");
        });

        socket.on("connect_error", () => {
            this.retryCount++;

            if (this.retryCount < this.maxRetries) {
                this.retryTimeout = setTimeout(() => {
                    this.connect();
                }, this.retryDelay);
            }
        });
    }
    emitMessage(messageName, messageData) {
        if (!this.socket) return;
        this.socket.emit(messageName, messageData);
    }
    listenMessage(messageName, callbackFunction) {
        this.listeners.set(messageName, callbackFunction); // store it
        if (!this.socket) return;
        this.socket.on(messageName, callbackFunction);
    }

    // 🔥 This is the key part
    retryAfterUserAction() {
        this.retryCount = 0; // reset retry cycle
        this.connect();
    }
    removeListener(event) {
        const cb = this.listeners.get(event);
        if (cb) {
            this.socket.off(event, cb);
            this.listeners.delete(event);
        }
    }
}

export const socketManager = new SocketManager();