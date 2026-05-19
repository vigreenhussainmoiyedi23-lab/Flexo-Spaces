const swapModel = require("../models/swap/swap.model");
const userModel = require("../models/user/user.model");
const { uploadImage } = require("../services/listing/UploadImage.service");
const { getUserAllListingsService, getUserAllDataService, getNotificationService, getUserAllRatingsService } = require("../services/user/user.service");


async function GetUserListingsHandler(req, res) {
    const { userId } = req.params;
    try {
        const listings = await getUserAllListingsService(userId);
        res.status(200).json({ listings, message: "Listings fetched successfully", success: true });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching listings", success: false });
    }
}
async function GetUserRatingHandler(req, res) {
    const { userId } = req.params;
    try {
        const ratings = await getUserAllRatingsService(userId);
        res.status(200).json({ ratings, message: "Ratings fetched successfully", success: true });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching listings", success: false });
    }
}

async function GetUserDataHandler(req, res) {
    const { userId } = req.params;
    try {
        const userData = await getUserAllDataService(userId);
        delete userData.password; // Remove sensitive information
        delete userData.__v; // Remove version key added by Mongoose
        delete userData.otp; // Remove OTP if it exists

        res.status(200).json({ userData, message: "User data fetched successfully", success: true });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching user data", success: false });
    }
}
const GetNotificationsHandler = async (req, res) => {
    try {
        const { page, limit } = req.query
        const notifications = await getNotificationService(req.userId, page, limit)
        res.status(200).json({ notifications, message: "Notifications fetched successfully", success: true })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching notifications", success: false });
    }
}
const GetRecentSwapsHandler = async (req, res) => {
    const { owner } = req.params
    try {
        const recentswaps = await swapModel.find({ owner: owner, status: { $nin: ["pending"] } }).sort({ createdAt: -1 }).limit(5)
            .select("status createdAt ownerListing requesterListing owner requester")
            .populate("requesterListing", "title images estimatedValue")
            .populate("ownerListing", "title images estimatedValue")
            .populate("owner", "username profilePicture email ")
            .populate("requester", "username profilePicture email ")
            .lean();
        res.status(200).json({ recentswaps, message: "Notifications fetched successfully", success: true })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching notifications", success: false });
    }
}
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profilePicture = req.file || null;
        const { username, bio, phoneNumber } = req.body;
        let data
        if (profilePicture) {
            data = await uploadImage(profilePicture.buffer, Date.now() + "-" + profilePicture.originalname, "SwapStyle/user/profilePicture");

        }
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(username && { username }),
                    ...(bio !== undefined && { bio }),
                    ...(phoneNumber && { phoneNumber }),
                    ...(data && { profilePicture: data.url }),
                },
            },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.log("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { updateProfile, GetUserRatingHandler, GetRecentSwapsHandler, GetUserListingsHandler, GetUserDataHandler, GetNotificationsHandler }