const express = require("express")
const swapRouter = express.Router()

// Middlewares & Controllers ⚙️
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")

const {
  getUserBookingsHandler,
  getSingleSwapHandler,
  acceptSwapHandler,
  rejectSwapHandler,
  cancelSwapHandler,
  completeSwapHandler,
  createDisputeHandler,
  getSwapAllDisputesHandler,
  createRatingHandler,
  getSpaceBookingHandler,
  createBookingHandler,
  getBookingAlternativeHandler,
  getBookingConsequencesHandler
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
swapRouter.get("/", isAuthenticated, getUserBookingsHandler)


/* @route GET - /api/swaps/:bookingId
@description  - Get details of a specific swap
@params  bookingId: ObjectId
@return  swap: object*/
swapRouter.get("/:bookingId", isAuthenticated, getSingleSwapHandler)
swapRouter.get("/:bookingId/alternative", isAuthenticated, getBookingAlternativeHandler)
swapRouter.get("/:bookingId/consequences", isAuthenticated, getBookingConsequencesHandler)
swapRouter.get("/:bookingId/disputes", isAuthenticated, getSwapAllDisputesHandler)


swapRouter.post("/:bookingId/dispute", createDisputeValidator, validate, isAuthenticated, createDisputeHandler)
swapRouter.post("/:bookingId/rating", isAuthenticated, createRatingHandler)

/* @route PATCH - /api/swaps/:bookingId/accept
@description - Accept a swap request (only listing owner)
@params   bookingId: ObjectId
@return  message: "Swap accepted"*/

swapRouter.patch("/:bookingId/accept", isAuthenticated, acceptSwapHandler)

/*@route - PATCH - /api/swaps/:bookingId/reject
@description - Reject a swap request (only listing owner)
@params  bookingId: ObjectId
@return  message: "Swap rejected"*/

swapRouter.patch("/:bookingId/reject", isAuthenticated, rejectSwapHandler)

/* @route PATCH - /api/swaps/:bookingId/cancel
@description - Cancel a swap request (only requester) - Only allowed if status is PENDING
@params  bookingId: ObjectId
@return message: "Swap cancelled" */

swapRouter.patch("/:bookingId/cancel", isAuthenticated, cancelSwapHandler)

/* @route PATCH - /api/swaps/:bookingId/complete
@description - Mark swap as completed after exchange (only requester) - Only allowed if status is ACCEPTED
@params bookingId: ObjectId
@return message: "Swap completed" */
swapRouter.patch("/:swapId/complete", isAuthenticated, completeSwapHandler)









module.exports = swapRouter