const mongoose = require("mongoose")

const disputeSchema = new mongoose.Schema({
    swapId: { type: mongoose.Schema.Types.ObjectId, ref: "swaps", required: true },
    raisedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "users", required: true
    },
    role: {
        type: String,
        enum: ["requester", "owner"],
        required: true
    },
    type: {
        type: String,
        enum: [
            "NOT_SHIPPED",
            "WRONG_ITEM",
            "DAMAGED_ITEM",
            "FRAUD",
            "OTHER"
        ],
        required: true
    },
    reason: { type: String, required: true },
    description: { type: String },
    resolution: {
        type: String,
        enum: ["FAVOR_REQUESTER", "FAVOR_OWNER", "NO_FAULT", "REFUND", "CANCEL_SWAP"]
    },
    adminNote: { type: String },
    status: {
        type: String,
        enum: ["open", "resolved", "rejected"],
        default: "open"
    }
}, { timestamps: true });
disputeSchema.index({ swapId: 1, raisedBy: 1 });
module.exports = mongoose.model("disputes", disputeSchema);