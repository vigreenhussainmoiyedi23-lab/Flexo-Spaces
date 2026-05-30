const express = require("express")
const swapRouter = express.Router()

// Middlewares & Controllers ⚙️
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")

const {
  getUserBookingsHandler,
  getSingleBookingHandler,
  acceptBookingHandler,
  rejectBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
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

swapRouter.post("/:spaceId/bookings", isAuthenticated, getSpaceBookingHandler)

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
swapRouter.post("/", isAuthenticated, getUserBookingsHandler)


/* @route GET - /api/swaps/:bookingId
@description  - Get details of a specific swap
@params  bookingId: ObjectId
@return  swap: object*/
swapRouter.get("/:bookingId", isAuthenticated, getSingleBookingHandler)
swapRouter.get("/:bookingId/alternative", isAuthenticated, getBookingAlternativeHandler)
swapRouter.get("/:bookingId/consequences", isAuthenticated, getBookingConsequencesHandler)


swapRouter.post("/:bookingId/rating", isAuthenticated, createRatingHandler)

/* @route PATCH - /api/swaps/:bookingId/accept
@description - Accept a swap request (only listing owner)
@params   bookingId: ObjectId
@return  message: "Booking accepted"*/

swapRouter.patch("/:bookingId/accept", isAuthenticated, acceptBookingHandler)

/*@route - PATCH - /api/swaps/:bookingId/reject
@description - Reject a swap request (only listing owner)
@params  bookingId: ObjectId
@return  message: "Booking rejected"*/

swapRouter.patch("/:bookingId/reject", isAuthenticated, rejectBookingHandler)

/* @route PATCH - /api/swaps/:bookingId/cancel
@description - Cancel a swap request (only requester) - Only allowed if status is PENDING
@params  bookingId: ObjectId
@return message: "Booking cancelled" */

swapRouter.patch("/:bookingId/cancel", isAuthenticated, cancelBookingHandler)

/* @route PATCH - /api/swaps/:bookingId/complete
@description - Mark swap as completed after exchange (only requester) - Only allowed if status is ACCEPTED
@params bookingId: ObjectId
@return message: "Swap completed" */
swapRouter.patch("/:bookingId/complete", isAuthenticated, completeBookingHandler)


swapRouter.get("/:bookingId/disputes", isAuthenticated, getSwapAllDisputesHandler)
swapRouter.post("/:bookingId/dispute", createDisputeValidator, validate, isAuthenticated, createDisputeHandler)







module.exports = swapRouter