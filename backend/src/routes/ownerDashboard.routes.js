const { Router } = require("express")
const router = Router()
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")
const userModel = require("../models/user/user.model")
const bookingModel = require("../models/booking/booking.model")
const spaceModel = require("../models/space.model")
const { default: mongoose } = require("mongoose")

router.get("/stats", isAuthenticated, async (req, res) => {
    try {
        const ownerId = req.userId;
        const [
            totalBookings,
            pendingBookings,
            completedBookings,
            totalSpaces,
            revenueResult
        ] = await Promise.all([
            bookingModel.countDocuments({
                owner: ownerId
            }),

            bookingModel.countDocuments({
                owner: ownerId,
                status: "pending"
            }),

            bookingModel.countDocuments({
                owner: ownerId,
                status: "completed"
            }),

            spaceModel.countDocuments({
                owner: ownerId
            }),

            bookingModel.aggregate([
                {
                    $match: {
                        owner: new mongoose.Types.ObjectId(ownerId),
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$pricing.finalPrice"
                        }
                    }
                }
            ])
        ]);

        return res.status(200).json({
            totalBookings,
            pendingBookings,
            completedBookings,
            totalSpaces,
            totalRevenue: revenueResult[0]?.totalRevenue || 0
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
router.get("/trends", isAuthenticated, async (req, res) => {
    try {
        const ownerId = req.userId;
        const days = Number(req.query.days) || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const trends = await bookingModel.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(ownerId),
                    createdAt: {
                        $gte: startDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    bookings: {
                        $sum: 1
                    },
                    revenue: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ["$status", "completed"]
                                },
                                "$pricing.finalPrice",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        const chartData = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toISOString().split("T")[0];
            const trend = trends.find(t => t._id === formattedDate);
            return {
                date: formattedDate,
                bookings: trend ? trend.bookings : 0,
                revenue: trend ? trend.revenue : 0
            };
        });
        return res.status(200).json({ chartData });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
router.get("/top-performer", isAuthenticated, async (req, res) => {
    try {
        const ownerId = req.userId;

        const result = await bookingModel.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(ownerId),
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: "$space",
                    bookings: {
                        $sum: 1
                    },
                    revenue: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ["$status", "completed"]
                                },
                                "$pricing.finalPrice",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    bookings: -1
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "spaces",
                    localField: "_id",
                    foreignField: "_id",
                    as: "space"
                }
            },
            {
                $unwind: "$space"
            }
        ]);

        return res.status(200).json(
            result[0] || null
        );

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router