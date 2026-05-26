const express = require("express")
const swapRouter = express.Router()

// Middlewares & Controllers ⚙️
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")

const {
  getUserSwapsHandler,
  getSingleSwapHandler,
  acceptSwapHandler,
  rejectSwapHandler,
  cancelSwapHandler,
  completeSwapHandler,
  createDisputeHandler,
  getSwapAllDisputesHandler,
  createRatingHandler,
  getSpaceBookingHandler,
  createBookingHandler
} = require("../controllers/swap.controller")
const { createDisputeValidator } = require("../Validators/swap.validator")
const { validate } = require("../Validators/validate")
// @req.userId contains the current user ID

swapRouter.get("/:spaceId/bookings", isAuthenticated, getSpaceBookingHandler)

/* 
@route - POST - /api/swaps
@description - Create a new swap request - User sends a swap request to a listing owner
@params -ownerId: ObjectId, requestedlistingId: ObjectId 
@body  offeredItemId: ObjectId, message?: string
@return Object:-  success: boolean ,  swap: object
*/

swapRouter.post("/:spaceId", isAuthenticated, createBookingHandler)


/*@route- GET - /api/swaps
  @description - Get all swaps of logged-in user - Includes both sent & received swaps
  @body filter:{status,shippmentType} 
  @return  swaps: []*/
swapRouter.post("/", isAuthenticated, getUserSwapsHandler)


/* @route GET - /api/swaps/:swapId
@description  - Get details of a specific swap
@params  swapId: ObjectId
@return  swap: object*/
swapRouter.get("/:swapId", isAuthenticated, getSingleSwapHandler)
swapRouter.get("/:swapId/disputes", isAuthenticated, getSwapAllDisputesHandler)


swapRouter.post("/:swapId/dispute", createDisputeValidator, validate, isAuthenticated, createDisputeHandler)
swapRouter.post("/:swapId/rating", isAuthenticated, createRatingHandler)

/* @route PATCH - /api/swaps/:swapId/accept
@description - Accept a swap request (only listing owner)
@params   swapId: ObjectId
@return  message: "Swap accepted"*/

swapRouter.patch("/:swapId/accept", isAuthenticated, acceptSwapHandler)

/*@route - PATCH - /api/swaps/:swapId/reject
@description - Reject a swap request (only listing owner)
@params  swapId: ObjectId
@return  message: "Swap rejected"*/

swapRouter.patch("/:swapId/reject", isAuthenticated, rejectSwapHandler)

/* @route PATCH - /api/swaps/:swapId/cancel
@description - Cancel a swap request (only requester) - Only allowed if status is PENDING
@params  swapId: ObjectId
@return message: "Swap cancelled" */

swapRouter.patch("/:swapId/cancel", isAuthenticated, cancelSwapHandler)

/* @route PATCH - /api/swaps/:swapId/complete
@description - Mark swap as completed after exchange (only requester) - Only allowed if status is ACCEPTED
@params swapId: ObjectId
@return message: "Swap completed" */
swapRouter.patch("/:swapId/complete", isAuthenticated, completeSwapHandler)









module.exports = swapRouter