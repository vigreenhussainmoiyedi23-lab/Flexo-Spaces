const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema({
    swapId: { type: mongoose.Schema.Types.ObjectId, ref: "swaps", required: true },
    rater: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    ratee: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    role: {
        type: String,
        enum: ["requester", "owner"],
        required: true
    },
    ratingValue: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
}, { timestamps: true })
ratingSchema.index({ swapId: 1, rater: 1 }, { unique: true })

const ratingModel = mongoose.model("ratings", ratingSchema)
module.exports = ratingModel