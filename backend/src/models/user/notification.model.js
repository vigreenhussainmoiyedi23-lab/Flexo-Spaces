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
                "BOOKING_REQUEST",
                "BOOKING_ACCEPTED",
                "BOOKING_REJECTED",
                "BOOKING_WITHDRAWN",
                "BOOKING_COMPLETED",
                "BOOKING_CANCELLED",
                "ADMIN_ALERT",
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


    },
    {
        timestamps: true, // gives createdAt, updatedAt
    }
);
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;