const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: [true, "User already exists in db"],
        required: true
    },
    password: {
        type: String,
    },
    googleId: { type: String, select: false },
    profilePicture: {
        type: String,
        default: "https://ik.imagekit.io/h110m786/pfp.jpg"
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isGoogleAuthenticated: {
        type: Boolean,
        default: false
    },
    isRegistered: { type: Boolean, default: false },
    otp: { type: String },           // hashed OTP
    otpExpires: { type: Date },
    bio: {
        type: String,
        default: "Sustainable fashion enthusiast. Trading vintage finds and timeless pieces."
    },
    phoneNumber: Number,


    rating: {
        type: Number,
        default: 0
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    totalSwaps: {
        type: Number,
        default: 0
    },
    totalCanceled: {
        type: Number,
        default: 0
    },
    fraudScore: {
        type: Number,
        default: 0
    },
    badge: {
        type: [String],
        default: ["Newbie"]
    }
}, { timestamps: true })


const userModel = mongoose.model("users", userSchema)
module.exports = userModel