const listingModel = require("../../models/listing.model");
const notificationModel = require("../../models/user/notification.model");
const userModel = require("../../models/user/user.model");
const ratingModel = require("../../models/user/rating.model");

async function findUserByEmail(email) {
    const user = await userModel.findOne({ email });
    return user;
}
async function findUserById(id) {
    return await userModel.findById(id);
}
async function findUserByIdAndUpdate(id, updateData) {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
}
async function createUser(userData) {
    return await userModel.create(userData);
}
/*
 * @param {string} userId - the id of the user whose listings are being fetched
 * @returns {object[]} - an array of listings owned by the user
 * @description Fetches all listings owned by a specific user from the database
 */
async function getUserAllListingsService(userId) {
    try {
        const listings = await listingModel.find({ owner: userId });
        return listings;
    } catch (error) {
        console.log("Error fetching user listings:", error);
        throw error;
    }
}
async function getUserAllRatingsService(userId) {
    try {
        const ratings = await ratingModel.find({ ratee: userId }).populate([{
            path: "rater",
            select: "username profilePicture email"
        },]);
        return ratings;
    } catch (error) {
        console.log("Error fetching user ratings:", error);
        throw error;
    }
}
async function getUserAllDataService(userId) {
    try {
        const user = await userModel.findById(userId).lean();
        return user;
    } catch (error) {
        console.log("Error fetching user data:", error);
        throw error;
    }
}
async function getNotificationService(userId, page = 1, limit = 20) {
    try {
        const skip = (page - 1) * limit;

        const notifications = await notificationModel
            .find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate("sender", "username profilePicture")
            .lean();

        // unread count BEFORE marking read
        const unreadCount = await notificationModel.countDocuments({
            recipient: userId,
            isRead: false
        });

        const total = await notificationModel.countDocuments({
            recipient: userId
        });

        return {
            notifications,
            unreadCount,
            total
        };

    } catch (error) {
        console.log("Error fetching notifications:", error);
        throw error;
    }
}

module.exports = { findUserByEmail, getUserAllRatingsService, getNotificationService, findUserById, findUserByIdAndUpdate, createUser, getUserAllListingsService, getUserAllDataService };