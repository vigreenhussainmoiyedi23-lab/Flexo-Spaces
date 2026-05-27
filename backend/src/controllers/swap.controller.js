const swapModel = require("../models/swap/swap.model");
const { getSwapByIdService, validateStateAndUser, validateSwapState, validateUserRole, ValidateSwap, updateBothListingFromSwapId, checkBothListingAreElligibleToSwap } = require("../services/swap/swap.utiliy");
const axios = require('axios');
const disputeModel = require("../models/swap/dispute.model");
const ratingModel = require("../models/user/rating.model");
const userModel = require("../models/user/user.model");
const bookingModel = require("../models/booking/booking.model");
const spaceModel = require("../models/space.model");
const { createBookingService, getAvailabilityService, generateAlternatives } = require("../services/swap/swap.service");

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

        const space = await spaceModel.findById(spaceId)
        if (!space) {
            return res.status(404).json({ message: "Space not found", success: false })
        }
        const user = req.userId

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
        const user = req.userId
        const role = req.userRole
        const currentBooking = await bookingModel.findById(req.params.bookingId)
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


async function getSingleSwapHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)

        ValidateSwap(swap, user)
        if (swap.requester.toString() !== user && swap.owner.toString() !== user) {
            // neither requester nor owner
            return res.status(401).json({ message: "Unauthorized", success: false })
        }
        res.status(200).json({
            swap,
            message: "Swap fetched successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        if (error.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error fetching swap",
            success: false
        })
    }
}


//Swap status transition flow:
// pending -> accepted -> completed
// pending -> rejected
// pending -> cancelled

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

async function acceptSwapHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)

        const isEligible = await checkBothListingAreElligibleToSwap(swapId)
        if (!isEligible) {
            return res.status(400).json({ message: "One of the listing is not available or locked", success: false })
        }
        ValidateSwap(swap, user)
        validateSwapState(swap, "pending")
        validateUserRole(swap, user, "owner")
        swap.status = "accepted"
        await swap.save()
        await updateBothListingFromSwapId(swapId, { isLocked: true })
        await swapModel.updateMany(
            {
                _id: { $ne: swap._id },
                $or: [
                    { requesterListing: swap.requesterListing },
                    { ownerListing: swap.ownerListing },
                    { ownerListing: swap.requesterListing },
                    { requesterListing: swap.ownerListing },
                ]
            },
            {
                $set: { status: "cancelled" }
            }
        );
        res.status(200).json({
            swap,
            message: "Swap accepted",
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            message: error.message || "Error accepting swap",
            success: false
        })
    }
}
async function rejectSwapHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)

        ValidateSwap(swap, user)

        validateSwapState(swap, "pending")
        validateUserRole(swap, user, "owner")

        swap.status = "rejected"
        await swap.save()
        await updateBothListingFromSwapId(swapId, { isLocked: false })

        res.status(200).json({
            swap,
            message: "Swap rejected",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Error rejecting swap",
            success: false
        })
    }
}
async function cancelSwapHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const swap = await getSwapByIdService(swapId)

        validateUserRole(swap, user, "requester")
        ValidateSwap(swap, user)
        validateSwapState(swap, "pending")
        await updateBothListingFromSwapId(swapId, { isLocked: false })

        swap.status = "cancelled"
        await swap.save()
        const Requester = await userModel.findById(user)
        Requester.totalCanceled += 1;
        await Requester.save();

        res.status(200).json({
            swap,
            message: "Swap cancelled",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Error cancelling swap",
            success: false
        })
    }
}
async function completeSwapHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId

        const swap = await getSwapByIdService(swapId)

        ValidateSwap(swap, user)
        validateSwapState(swap, "shipping")

        let hasShipped = swap.shipments.find(s => s.from.toString() === user)
        if (!hasShipped && swap.shipment_type === "shipping") {
            return res.status(400).json({ message: "First you should ship", success: false })
        }
        const role = swap.owner.toString() === user ? "owner" : "requester"

        swap.completedBy[role] = true
        await swap.save()
        if (swap.completedBy.owner && swap.completedBy.requester) {
            swap.status = "completed"
            await swap.save()
            await updateBothListingFromSwapId(swapId, { isAvailable: false })
        }
        const { owner, requester } = swap
        const ownerUser = await userModel.findById(owner)
        const requesterUser = await userModel.findById(requester)
        ownerUser.totalSwaps += 1;
        requesterUser.totalSwaps += 1;
        await ownerUser.save();
        await requesterUser.save();
        res.status(200).json({
            swap,
            message: "Swap completed",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: error.message || "Error completing swap",
            success: false
        })
    }
}



module.exports = {
    createBookingHandler,
    getUserBookingsHandler,
    getSingleSwapHandler,
    acceptSwapHandler,
    rejectSwapHandler,
    cancelSwapHandler,
    completeSwapHandler,
    createDisputeHandler,
    getBookingConsequencesHandler,
    getBookingAlternativeHandler,
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