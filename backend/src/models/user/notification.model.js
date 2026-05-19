const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },

        type: {
            type: String,
            enum: [
                "NEW_MESSAGE",
                "SWAP_REQUEST",
                "SWAP_ACCEPTED",
                "SWAP_REJECTED",
                "SWAP_COMPLETED",
                "LISTING_LIKED",
                "DISPUTE_CREATED",
                "DISPUTE_RESOLVED",
                "ADMIN_ALERT",
                "SWAP_CANCELLED",
                "SWAP_SHIPPED",
                "SWAP_ADDRESS_ADDED",
                "NEW_RATING"
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
        },

        link: {
            type: String, // e.g. "/chat/123", "/swap/456"
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        // Optional: group notifications (future scalability)
        groupKey: {
            type: String, // e.g. "swap_123"
        },

        // Optional: store extra metadata
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true, // gives createdAt, updatedAt
    }
);
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;