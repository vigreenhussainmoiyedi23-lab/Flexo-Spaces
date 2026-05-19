const { response } = require("express");
const { validateLocation } = require("../Validators/locationValidator");
const listingModel = require("../models/listing.model");
const changeHistoryModel = require("../models/swap/changeHistory.model");
const swapModel = require("../models/swap/swap.model");
const { getListingByIdService } = require("../services/listing/DBFunctions.service");
const { createSwapService, getTrackingLink } = require("../services/swap/swap.service");
const { getSwapByIdService, validateStateAndUser, validateSwapState, validateUserRole, ValidateSwap, updateBothListingFromSwapId, checkBothListingAreElligibleToSwap } = require("../services/swap/swap.utiliy");
const axios = require('axios');
const disputeModel = require("../models/swap/dispute.model");
const ratingModel = require("../models/user/rating.model");
const userModel = require("../models/user/user.model");

async function createSwapHandler(req, res) {
    try {
        const { ownerListingId } = req.params
        const { requesterListingId, message } = req.body
        if (!ownerListingId || !requesterListingId) {
            return res.status(400).json({ message: "Both ownerListingId and requesterListingId are required", success: false })
        }
        const user = req.userId
        const ownerListing = await getListingByIdService(ownerListingId)
        const requestedListing = await getListingByIdService(requesterListingId)

        const response = await createSwapService(ownerListing, requestedListing, message, user)
        if (!response.success) return res.status(400).json({ message: response.message, success: false })
        res.status(201).json({
            swap: response.swap,
            message: "Swap request created",
            success: true
        })
    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error creating swap",
            success: false
        })
    }
}

async function getUserSwapsHandler(req, res) {
    try {
        const user = req.userId
        const { filters } = req.body
        const { status, shipment_type, type, page, limit } = filters || {}
        let query = {}
        if (type === "sent") {
            query.requester = user
        } else if (type === "received") {
            query.owner = user
        } else {
            query = {
                $or: [
                    { requester: user },
                    { owner: user }
                ]
            }
        }
        if (status !== "all" && Array.isArray(status)) {
            query.status = { $in: status }
        } else if (status !== "all") {
            query.status = status
        }
        if (shipment_type !== "all") {
            query.shipment_type = shipment_type
        }
        const swaps = await swapModel.find(query).populate([
            {
                path: "requester",
                select: "rating profilePicture _id username email"
            },
            {
                path: "owner",
                select: "rating profilePicture _id username email"
            },
            {
                path: "requesterListing"
            },
            {
                path: "ownerListing"
            }
        ]).skip((page - 1) * limit).limit(limit).lean()
        let totalSwaps = await swapModel.countDocuments(query)
        let totalPages = Math.ceil(totalSwaps / limit)
        let swapWithRolesAndShipped = swaps.map(swap => {
            let role = null
            let hasShipped = swap.shipment_type == "local_swap" || !!swap.shipments.find(s => s.from.toString() === user.toString())
            if (swap.requester._id.toString() === user) {
                role = "requester"
            }
            if (swap.owner._id.toString() === user) {
                role = "owner"
            }
            let hasCompleted = swap.completedBy[role]
            let hasGivenAddress = swap.AddresGivenBy[role]
            let hasRaisedDispute = swap.disputedBy[role]
            let hasRatedUser = swap.ratedBy[role]
            return { ...swap, role, hasShipped, hasCompleted, hasGivenAddress, hasRaisedDispute, hasRatedUser }
        })
        res.status(200).json({
            swaps: swapWithRolesAndShipped,
            totalSwaps,
            totalPages,
            message: "Swaps fetched",
            success: true
        })

    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error fetching user's swap",
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
async function shipmentDetailsHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const { courier, trackingId } = req.body
        const swap = await getSwapByIdService(swapId)
        ValidateSwap(swap, user)
        validateSwapState(swap, "prepared_to_ship")
        let role = user.toString() === swap.owner.toString() ? "owner" : "requester"
        if (swap.shipment_type === "local_swap") {
            return res.status(200).json({ message: "No shipment details needed for local swap", success: false })
        }
        const isShipmentExist = swap.shipments?.find(
            (shipment) => shipment.from.toString() === user
        )
        if (!swap.shipments || swap.shipments.length === 0) {
            swap.shipments = []
        }
        if (isShipmentExist) {
            return res.status(400).json({ message: "Shipment details already exist", success: false })
        }
        const url = await getTrackingLink(courier, trackingId)
        swap.shipments.push({
            from: user,
            courier,
            trackingId,
            trackingUrl: url
        })
        swap.shippedBy[role] = true
        const { requester, owner } = swap.shippedBy
        if (requester && owner) {
            swap.status = "shipping"
        }
        await swap.save()
        res.status(200).json({
            message: "Shipment details added succesfully",
            swap,
            success: true
        })
    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error updating shipment details for swap",
            success: false
        })
    }
}
async function changeShipmentTypeHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const { changeTo } = req.body
        if (!["local_swap", "shipping"].includes(changeTo)) {
            return res.status(400).json({ message: "Invalid shipment type", success: false })
        }

        const swap = await getSwapByIdService(swapId)
        ValidateSwap(swap, user)
        if (swap.shipment_type === changeTo) {
            return res.status(400).json({ message: "Shipment type already same", success: false })
        }
        if (swap.shipment_type === "shipping" && swap.status !== "accepted") {
            return res.status(400).json({ message: "Swap already shipped", success: false })
        }
        let { owner, requester } = swap.completedBy
        if (owner || requester) {
            return res.status(400).json({ message: "Swap already completed By one of the users", success: false })
        }
        swap.shipment_type = changeTo
        if (changeTo === "local_swap") {
            swap.status = "shipping"
        }
        if (changeTo === "shipping") {
            swap.status = "accepted"
        }
        const changeHistory = await changeHistoryModel.create({
            changedBy: user,
            changeType: "shipment_type_update",
            previousValue: swap.shipment_type,
            newValue: changeTo
        })
        swap.changeHistory.push(changeHistory._id)

        await swap.save()

        res.status(200).json({
            message: "Shipment Type updated",
            swap,
            success: true
        })
    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(500).json({
            message: "Error updating shipment Type for swap",
            success: false
        })
    }
}
async function shippingAddressHandler(req, res) {
    try {
        const { swapId } = req.params
        const user = req.userId
        const { street, city, pincode, country, state, phone } = req.body
        if (!street || !phone) {
            return res.status(400).json({ message: "Both  Phone number And Street is required", success: false })
        }
        const postalcheckerurl = process.env.POSTALCODE_CHECKER_URL + pincode
        const { data } = await axios.get(postalcheckerurl)
        if (data[0].Status == "Error") {
            return res.status(400).json({ message: "Invalid Pincode", success: false })
        }
        const response = await validateLocation({ country, state, city })


        const swap = await getSwapByIdService(swapId)
        let role = swap.owner.toString() === user ? "owner" : "requester"
        if (swap.AddresGivenBy[role]) {
            return res.status(400).json({ message: "Shipping address already given", success: false })
        }
        ValidateSwap(swap, user)
        validateSwapState(swap, "accepted")
        let AddressToBeAdded = swap.owner.toString() === user ? "ownerAddress" : "requesterAddress"
        swap[AddressToBeAdded] = {
            street,
            city: response.city,
            state: response.state,
            pincode,
            country: response.country,
            phoneNumber: phone
        }
        swap.AddresGivenBy[role] = true
        const { owner, requester } = swap.AddresGivenBy
        if (owner && requester) {
            swap.status = "prepared_to_ship"
        }
        await swap.save()
        res.status(200).json({
            message: "shipping Address updated successfully",
            success: true,
            swap: swap
        })
    } catch (error) {
        if (error?.status) return res.status(error.status).json({ message: error.message, success: false })
        res.status(error.status || 500).json({
            message: error.message || "Error updating shipping address for swap",
            success: false
        })
    }
}


module.exports = {
    createSwapHandler,
    getUserSwapsHandler,
    getSingleSwapHandler,
    acceptSwapHandler,
    rejectSwapHandler,
    cancelSwapHandler,
    completeSwapHandler,
    shipmentDetailsHandler,
    changeShipmentTypeHandler,
    shippingAddressHandler,
    createDisputeHandler,
    getSwapAllDisputesHandler, createRatingHandler
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