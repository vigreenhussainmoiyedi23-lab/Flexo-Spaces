
/*
--> validateSwapAccess (utility)
   - checks if user is either requester or owner of swap
   - prevents unauthorized access to swap data
   - used in multiple services for security


--> validateSwapState (utility)
   - ensures swap is in expected state before action
   - prevents invalid transitions (like complete before accept)
   - centralizes state validation logic

*/

const bookingModel = require("../../models/booking/booking.model");

async function getBookingByIdService(bookingId) {
   // validates that the bookingId is real and the user asked for 
   // it is part of the booking
   const booking = await bookingModel.findById(bookingId)
   if (!booking) {
      throw new Error("Booking not found", 404)
   }
   return booking
}
function validateBooking(booking, user) {
   if (
      booking.bookedBy.toString() !== user &&
      booking.owner.toString() !== user
   ) {
      throw new Error("Unauthorized", 403)
   }
}

function validateBookingState(booking, expectedState) {
   if (booking.status !== expectedState) {
      throw new Error("Invalid booking state", 400);
   }
}
function validateUserRole(booking, userId, role) {
   const isOwner = booking.owner.toString() === userId;
   const isBooker = booking.bookedBy.toString() === userId;
   console.log("Validating user role:", { isOwner, isBooker, role });
   if (role === "bookedBy" && !isBooker) {
      throw new Error("Only bookedBy can perform this action", 403);
   }
   if (role === "owner" && !isOwner) {
      throw new Error("Only owner can perform this action", 403);
   }
}
async function updateOneBooking(from, to, bookingId, userId) {
   const booking = await bookingModel.findOneAndUpdate({
      _id: bookingId,
      status: from,
      owner: userId
   }, {
      status: to
   }, { new: true }
   )
   if (!booking) {
      throw new Error("Booking not found or user not authorized or invalid booking state")
   }
   return booking
}
module.exports = { updateOneBooking, getBookingByIdService, validateBookingState, validateUserRole, validateBooking }