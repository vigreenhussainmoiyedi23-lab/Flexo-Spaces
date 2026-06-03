const { getSwapByIdService, validateStateAndUser, validateSwapState, validateUserRole, ValidateSwap, updateBothListingFromSwapId, checkBothListingAreElligibleToSwap, updateOneBooking, validateBooking, validateBookingState, getBookingByIdService } = require("../services/swap/swap.utiliy");
const axios = require('axios');
const ratingModel = require("../models/user/rating.model");
const userModel = require("../models/user/user.model");
const bookingModel = require("../models/booking/booking.model");
const spaceModel = require("../models/space.model");
const { createBookingService, getAvailabilityService, generateAlternatives, genearateConsequence } = require("../services/swap/swap.service");
const agenda = require("../config/agenda");
const razorpay = require("../config/razorpay");
const { verifyRazorpayPayment } = require("../utils/razorpay");

async function createBookingHandler(req, res) {
    try {
        const { spaceId } = req.params
        const { fromDate, fromTime, toDate, toTime,
            selectedSeats, fullName, notes } = req.body
        if (!spaceId) {
            return res.status(400).json({ message: " spaceId  is required", success: false })
        }
        const availability = await getAvailabilityService({
            spaceId,
            fromDate,
            toDate,
            fromTime,
            toTime
        });
        if (
            availability.availableSeats <
            selectedSeats
        ) {
            return res.status(400).json({
                success: false,
                message: "Not enough seats available"
            });
        }
        const isBookingExist = await bookingModel.findOne({
            space: spaceId,
            status: { $in: ["pending", "accepted"] },

            fromDateTime: {
                $lt: new Date(`${toDate}T${toTime}:00.000Z`)
            },

            endDateTime: {
                $gt: new Date(`${fromDate}T${fromTime}:00.000Z`)
            }
        });
        if (isBookingExist) {
            return res.status(400).json({
                success: false,
                message: "Booking already exists"
            });
        }

        const space = await spaceModel.findById(spaceId)
        if (!space) {
            return res.status(404).json({ message: "Space not found", success: false })
        }
        const user = req.userId
        if (space.owner.toString() === user.toString()) {
            return res.status(400).json({ message: "You cannot book your own space", success: false })
        }
        const response = await createBookingService({
            fromDateTime: new Date(`${fromDate}T${fromTime}:00.000Z`),
            toDateTime: new Date(`${toDate}T${toTime}:00.000Z`),
            seatsBooked: selectedSeats,
            fullName,
            notes,
            bookingType: space.pricing.interval,
            spaceId,
            user,
            availability,
            bookedBy: user,
            owner: space.owner,
            resource: space.spaceType,
            totalCapacitySnapshot: space.capacity,
            remainingCapacitySnapshot: availability.availableSeats - selectedSeats
        })


        await agenda.schedule("in 24 hours", "expire booking", { bookingId: response.booking._id })
        res.status(201).json({
            booking: response.booking,
            message: "booking created",
            success: true
        })
    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error creating booking",
            success: false
        })
    }
}
async function getSpaceBookingHandler(req, res) {
    try {
        console.log("space bookings")
        const { spaceId } = req.params;
        const {
            fromDate,
            fromTime,
            toDate,
            toTime
        } = req.body;
        const { availableSeats, overlappingBookings } = await getAvailabilityService({
            spaceId,
            fromDate,
            toDate,
            toTime,
            fromTime
        })
        console.log(availableSeats, overlappingBookings)
        res.status(200).json({
            success: true,
            availableSeats,
            overlappingBookings
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
async function getUserBookingsHandler(req, res) {
    try {
        const user = req.userId
        const role = req.userRole
        let page = 1
        let limit = 10
        // const { filters } = req.body
        // const { status, shipment_type, type, page, limit } = filters || {}
        let query = {}
        // if (type === "sent") {
        //     query.requester = user
        // } else if (type === "received") {
        //     query.owner = user
        // } else {
        //     query = {
        //         $or: [
        //             { requester: user },
        //             { owner: user }
        //         ]
        //     }
        // }
        // if (status !== "all" && Array.isArray(status)) {
        //     query.status = { $in: status }
        // } else if (status !== "all") {
        //     query.status = status
        // }
        // if (shipment_type !== "all") {
        //     query.shipment_type = shipment_type
        // }
        if (role === "user") {
            query = {
                bookedBy: user
            }
        } else if (role === "space_owner") {
            query.owner = user
        }
        const Bookings = await bookingModel.find(query).populate([
            {
                path: "bookedBy",
                select: "rating profilePicture _id username email"
            },
            {
                path: "owner",
                select: "rating profilePicture _id username email"
            },
            {
                path: "space"
            },
        ]).skip((page - 1) * limit).limit(limit).lean()
        let totalBookings = await bookingModel.countDocuments(query)
        let totalPages = Math.ceil(totalBookings / limit)

        res.status(200).json({
            bookings: Bookings,
            totalBookings,
            totalPages,
            message: "Bookings fetched",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error fetching user's bookings",
            success: false
        })
    }
}
async function getBookingAlternativeHandler(req, res) {
    try {
        const currentBooking = await bookingModel.findById(req.params.bookingId)
        if (!currentBooking) return res.status(404).json({ message: "Booking not found", success: false })
        console.log("getting alternatives for booking ", req.params.bookingId)
        const Bookings = await bookingModel.find({
            status: "pending",
            _id: { $ne: req.params.bookingId },
            space: currentBooking.space,
            fromDateTime: { $lte: currentBooking.endDateTime },
            endDateTime: { $gte: currentBooking.fromDateTime },
        }).populate([
            {
                path: "bookedBy",
                select: "rating profilePicture _id username email"
            },
            {
                path: "owner",
                select: "rating profilePicture _id username email"
            },
            {
                path: "space"
            },
        ]).sort({ fromDateTime: 1 }).lean()
        const result = await generateAlternatives(currentBooking, Bookings)
        res.status(200).json({
            result,
            message: "Bookings fetched",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error fetching user's bookings",
            success: false
        })
    }
}
async function getBookingConsequencesHandler(req, res) {
    try {
        const user = req.userId
        const role = req.userRole
        const currentBooking = await bookingModel.findById(req.params.bookingId)
        const Bookings = await bookingModel.find({
            status: "pending",
            _id: { $ne: req.params.bookingId },
            space: currentBooking.space,
            fromDateTime: { $lte: currentBooking.endDateTime },
            endDateTime: { $gte: currentBooking.fromDateTime },
        }).populate([
            {
                path: "bookedBy",
                select: "rating profilePicture _id username email"
            },
            {
                path: "owner",
                select: "rating profilePicture _id username email"
            },
            {
                path: "space"
            },
        ]).sort({ fromDateTime: 1 }).lean()
        const result = await genearateConsequence(currentBooking, Bookings)
        res.status(200).json({
            consequences: result,
            message: "Bookings fetched",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error fetching user's bookings",
            success: false
        })
    }
}


async function getSingleBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        const user = req.userId
        const booking = await bookingModel.findById(bookingId).populate([

        ])
        if (!booking) {
            return res.status(404).json({ message: "Booking not found", success: false })
        }
        if (booking.bookedBy.toString() !== user && booking.owner.toString() !== user) {
            // neither requester nor owner
            return res.status(401).json({ message: "Unauthorized", success: false })
        }
        res.status(200).json({
            booking,
            message: "Booking fetched successfully",
            success: true
        })

    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error fetching booking details",
            success: false
        })
    }
}


//Booking status transition flow:
// pending -> accepted  -> confirmed -> checked_in -> completed
// pending -> rejected
// pending -> cancelled
// accepted -> cancelled (by owner or requester, but with different consequences)
// pending -> expired
async function acceptBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        const booking = await updateOneBooking("pending", "accepted", bookingId, req.userId)
        const { availableSeats } = await getAvailabilityService({
            spaceId: booking.space,
            fromDateTime: booking.fromDateTime,
            endDateTime: booking.endDateTime
        })
        // const order = await razorpay.orders.create({
        //     amount: booking.pricing.finalPrice * 100, // amount in paise
        //     currency: "INR",
        //     receipt: `booking_${booking._id}`,
        // })
        const bookings = await bookingModel.updateMany(
            {
                _id: { $ne: bookingId },
                space: booking.space,
                fromDateTime: { $lt: booking.endDateTime },
                endDateTime: { $gt: booking.fromDateTime },
                status: "pending",
                seatsBooked: { $gt: availableSeats }
            },
            {
                $set: { status: "rejected" }
            }
        );
        res.status(200).json({
            booking,
            message: "booking accepted",
            success: true,
            bookings
        })

    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Error accepting booking",
            success: false
        })
    }
}

async function verifyPaymentHandler(req, res) {
    try {

        const { bookingId } = req.params

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body

        // 1. Find booking

        const booking =
            await bookingModel.findById(bookingId)

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }
        if (booking.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Already paid ",
                booking
            })
        }
        if (
            booking.status !== "accepted" || new Date() > new Date(booking.lockExpiresAt)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Booking not awaiting payment"
            })
        }

        const isAuthentic = verifyRazorpayPayment({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        })
        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment verification failed"
            })
        }

        // 4. Confirm booking

        booking.status = "confirmed"

        booking.paymentStatus = "paid"

        booking.paymentDetails = {
            ...booking.paymentDetails,

            transactionId:
                razorpay_payment_id,

            razorpayOrderId:
                razorpay_order_id,

            paymentMethod: "razorpay",

            paidAt: new Date()
        }

        // optional cleanup
        booking.lockExpiresAt = null

        await booking.save()

        return res.status(200).json({
            success: true,
            message:
                "Payment verified successfully",
            booking
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

async function completeBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        const user = req.userId

        const booking = await getBookingByIdService(bookingId)

        validateBooking(booking, user)
        validateBookingState(booking, "accepted")
        validateUserRole(booking, user, "owner")


        booking.status = "completed"
        await booking.save()

        await Promise.all([
            userModel.findByIdAndUpdate(booking.owner, {
                $inc: { totalCompleted: 1 }
            }),
            userModel.findByIdAndUpdate(booking.bookedBy, {
                $inc: { totalCompleted: 1 }
            })
        ])
        res.status(200).json({
            booking,
            message: "Booking completed",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error completing booking",
            success: false
        })
    }
}
async function rejectBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        const user = req.userId
        const booking = await getBookingByIdService(bookingId)

        validateBooking(booking, user)
        validateBookingState(booking, "pending")
        validateUserRole(booking, user, "owner")

        booking.status = "rejected"
        await booking.save()

        res.status(200).json({
            booking,
            message: "Booking rejected",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Error rejecting booking",
            success: false
        })
    }
}
async function withdrawBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        const user = req.userId
        const booking = await getBookingByIdService(bookingId)

        validateBooking(booking, user)
        validateBookingState(booking, "pending")
        validateUserRole(booking, user, "bookedBy")

        booking.status = "withdrawn"
        await booking.save()

        res.status(200).json({
            booking,
            message: "Booking withdrawed",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Error withdrawing booking",
            success: false
        })
    }
}
async function cancelBookingHandler(req, res) {
    try {
        const { bookingId } = req.params
        if (!req.body.reason) {
            return res.status(400).json({ message: "Cancellation reason is required", success: false })
        }
        const user = req.userId
        const booking = await getBookingByIdService(bookingId)

        validateUserRole(booking, user, "requester")
        validateBooking(booking, user)
        if (booking.status !== "accepted" && booking.paymentStatus == "pending") {
            return res.status(400).json({ message: "Only accepted bookings can be cancelled", success: false })
        }

        booking.status = "cancelled"
        booking.cancellation = {
            cancelledBy: user,
            cancelledAt: new Date(),
            reason: req.body.reason,
        }
        await booking.save()
        await userModel.findByIdAndUpdate(user, {
            $inc: { totalCanceled: 1, fraudScore: 10 },
        })
        res.status(200).json({
            booking,
            message: "Booking cancelled",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Error cancelling booking",
            success: false
        })
    }
}




async function createDisputeHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)
        const { type, reason, description } = req.body
        ValidateSwap(swap, user)
        if (swap.status !== "shipping" && swap.status !== "disputed" && swap.status !== "prepared_to_ship") {
            return res.status(400).json({ message: "Swap is not in shipping or disputed state", success: false })
        }
        let role = swap.owner.toString() === user ? "owner" : "requester"
        let hasAlreadyCreatedADispute = swap.disputedBy[role]
        if (hasAlreadyCreatedADispute) {
            return res.status(400).json({ message: "You have already raised a dispute", success: false })
        }
        const dispute = await disputeModel.create({
            swapId: swap._id,
            raisedBy: user,
            role,
            type,
            reason,
            description
        })

        swap.status = "disputed"
        swap.disputedBy[role] = true
        await swap.save()

        res.status(200).json({
            message: "dispute Created",
            success: true,
            swap
        })

    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Error creating dispute",
            success: false
        })
    }
}
async function createRatingHandler(req, res) {
    try {
        const { swapId } = req.params;
        const user = req.userId;

        const swap = await getSwapByIdService(swapId);
        ValidateSwap(swap, user);

        if (swap.status !== "completed") {
            return res.status(400).json({
                message: "Swap is not in completed state",
                success: false,
            });
        }

        // ✅ Determine role + ratee securely
        let role, ratee;

        if (swap.owner.toString() === user) {
            role = "owner";
            ratee = swap.requester;
        } else {
            role = "requester";
            ratee = swap.owner;
        }

        // ❌ prevent self rating
        if (ratee.toString() === user) {
            return res.status(400).json({
                message: "You cannot rate yourself",
                success: false,
            });
        }

        // ✅ check if already rated
        const ratingExists = await ratingModel.findOne({
            swapId: swap._id,
            rater: user,
        });

        if (ratingExists) {
            return res.status(400).json({
                message: "You have already rated this swap",
                success: false,
            });
        }

        // ✅ create rating
        await ratingModel.create({
            swapId: swap._id,
            ratee,
            rater: user,
            role,
            ratingValue: Number(req.body.ratingValue),
            comment: req.body.comment,
        });

        // ✅ update swap state
        swap.ratedBy = {
            ...swap.ratedBy,
            [role]: true,
        };
        await swap.save();

        // ✅ OPTIMIZED aggregation (NO full scan in JS)
        const stats = await ratingModel.aggregate([
            { $match: { ratee } },
            {
                $group: {
                    _id: "$ratee",
                    avgRating: { $avg: "$ratingValue" },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        const avgRating = stats[0]?.avgRating || 0;

        // ✅ update user
        await userModel.findByIdAndUpdate(ratee, {
            rating: Number(avgRating.toFixed(2)), // keeps decimal
        });

        return res.status(200).json({
            message: "Rating created successfully",
            success: true,
            swap,
        });

    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({
            message: error.message || "Error creating rating",
            success: false,
        });
    }
}
async function getSwapAllDisputesHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)
        ValidateSwap(swap, user)
        const disputes = await disputeModel.find({ swapId: swap._id }).populate([{
            path: "raisedBy",
            select: "username profilePicture email",
        }])


        res.status(200).json({
            message: "Here Are All Disputes",
            disputes,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            message: error.message || "Error creating dispute",
            success: false
        })
    }
}


module.exports = {
    createBookingHandler,
    withdrawBookingHandler,
    getUserBookingsHandler,
    getSingleBookingHandler,
    acceptBookingHandler,
    rejectBookingHandler,
    cancelBookingHandler,
    completeBookingHandler,
    createDisputeHandler,
    getBookingConsequencesHandler,
    getBookingAlternativeHandler,
    verifyPaymentHandler,
    getSwapAllDisputesHandler, createRatingHandler, getSpaceBookingHandler
}

/*  Read the comments for better understanding of my 
swap controllers as i will forget their usecase soon -Hussain


--> create swap comments
   - first get requested listing id from params and offered listing id from body
   - then fetch both listings from db
   - check if both listings exist else return error
   - check user is not trying to swap his own listing
   - check offered listing actually belongs to the logged-in user
   - (optional) check if requested listing is already in an active swap (avoid conflicts)
   - create a new swap with requester, owner, requestedListing, offeredListing
   - set initial status as PENDING
   - save swap in db
   - return success response with swap object


--> get user swaps comments
   - get logged-in user id
   - check query type (sent / received)
   - if type is sent → fetch swaps where requester = user
   - if type is received → fetch swaps where owner = user
   - else fetch both (sent + received)
   - return all swaps


--> get single swap comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is either requester or owner
   - if not authorized return error
   - return swap details


--> accept swap comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is the owner (only owner can accept)
   - check if swap status is PENDING
   - update status to ACCEPTED
   - save swap
   - return success response


--> reject swap comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is the owner
   - check if swap status is PENDING
   - update status to REJECTED
   - save swap
   - return success response


--> cancel swap comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is requester (only requester can cancel)
   - check if swap status is still PENDING
   - update status to CANCELLED
   - save swap
   - return success response


--> complete swap comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is either requester or owner
   - check if swap status is ACCEPTED (must be accepted before completion)
   - update status to COMPLETED
   - save swap
   - return success response


--> shipment details comments
   - get swapId from params
   - fetch swap from db
   - if swap not found return error
   - check if logged-in user is part of swap (requester or owner)
   - get courier and trackingId from body
   - initialize shipment array if not present
   - push new shipment object with user, courier, trackingId
   - save swap
   - return success response

*/