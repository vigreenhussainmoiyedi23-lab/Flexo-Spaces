const mongoose = require("mongoose")

const changeHistorySchema = new mongoose.Schema({
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    changeType: {
        type: String,
        enum: ["status_change",
            "shipment_update",
            "completion_update",
            "shipment_type_update"],
        default: "status_change"
    },
    previousValue: String,
    newValue: String,
}, { timestamps: true })

const changeHistoryModel = mongoose.model("ChangeHistory", changeHistorySchema)

module.exports = changeHistoryModel