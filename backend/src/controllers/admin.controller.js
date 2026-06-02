const redis = require("../config/cache")
const userModel = require("../models/user/user.model")
const listingModel = require("../models/space.model.js")
const { GeneratePlatformInsight } = require("../services/ai/PlatformSummary.service.js")


/**
 * @query page, limit, search
 * @returns { users, total, page, pages }
 */
async function GetAllUsersHandler(req, res) {
    try {
        const { page = 1, limit = 10, search = "" } = req.query

        const query = search
            ? { name: { $regex: search, $options: "i" } }
            : {}

        const users = await userModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 })

        const total = await userModel.countDocuments(query)

        res.json({
            success: true,
            users,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

/**
 * @query page, limit, category, status
 * @returns { listings, total }
 */
async function GetAllListingsHandler(req, res) {
    try {
        const { page = 1, limit = 10, category, status } = req.query

        const query = {}
        if (category) query.category = category
        if (status) query.status = status

        const listings = await listingModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 })

        const total = await listingModel.countDocuments(query)

        res.json({ success: true, listings, total })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}


async function GetPlatformOverviewHandler(req, res) {
    try {
        const cacheKey = "SWAPSTYLE:analytics:overview"

        const cached = await redis.get(cacheKey)
        if (cached) {
            return res.json({
                success: true,
                source: "cache",
                data: JSON.parse(cached)
            })
        }

        const last28Days = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)


        // 🔥 helper for daily aggregation
        const getDailyData = async (model) => {
            const raw = await model.aggregate([
                {
                    $match: { createdAt: { $gte: last28Days } }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                                timezone: "Asia/Kolkata"
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
            // 🧠 fill missing days (IMPORTANT)
            const map = new Map()
            raw.forEach(item => map.set(item._id, item.count))

            const result = []
            for (let i = 27; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)

                const key = d.toISOString().split("T")[0]
                result.push({
                    date: key,
                    count: map.get(key) || 0
                })
            }

            return result
        }

        // 🔥 run all in parallel
        const [
            totalUsers,
            totalListings,

            usersDaily,
            listingsDaily,
        ] = await Promise.all([
            userModel.countDocuments(),
            listingModel.countDocuments(),

            getDailyData(userModel),
            getDailyData(listingModel),
        ])

        const data = {
            totals: {
                users: totalUsers,
                listings: totalListings,
            },
            daily: {
                users: usersDaily,
                listings: listingsDaily,
            }
        }
        const insight = await GeneratePlatformInsight(data)
        data.insights = insight
        await redis.set(cacheKey, JSON.stringify(data), "EX", 100)

        res.status(200).json({
            success: true,
            source: "db",
            data
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

/**
 * @params userId
 * @returns updated user
 */
async function BanOrUnbanUserHandler(req, res) {
    try {
        const { userId } = req.params

        const user = await userModel.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" })

        user.isBanned = !user.isBanned
        await user.save()

        res.json({ success: true, user })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
/**
 * @params listingId
 * @returns updated listing
 */
async function RemoveOrRestoreListingHandler(req, res) {
    try {
        const { listingId } = req.params

        const listing = await listingModel.findById(listingId)
        if (!listing) return res.status(404).json({ message: "Listing not found" })

        listing.isRemoved = !listing.isRemoved
        await listing.save()

        res.json({ success: true, listing })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
/**
 * @params disputeId
 * @body { 
 * status: "resolved" | "closed"  
 * resolution:"FAVOR_REQUESTER"| "FAVOR_OWNER"| "NO_FAULT"| "REFUND"| "CANCEL_SWAP" ,
 * adminNote:String
 *  }
 * @returns updated dispute
 */

module.exports = {
    GetAllUsersHandler,
    GetAllListingsHandler,

    BanOrUnbanUserHandler,
    RemoveOrRestoreListingHandler,

    GetPlatformOverviewHandler,
}