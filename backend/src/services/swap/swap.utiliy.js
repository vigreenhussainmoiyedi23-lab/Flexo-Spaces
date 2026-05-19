
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

const listingModel = require("../../models/listing.model");
const swapModel = require("../../models/swap/swap.model");

async function getSwapByIdService(swapId) {
   // validates that the swapid is real and the user asked for 
   // it is part of the swap
   const swap = await swapModel.findById(swapId)
   if (!swap) {
      throw new Error("Swap not found", 404)
   }
   return swap
}
function ValidateSwap(swap, user) {
   if (
      swap.requester.toString() !== user &&
      swap.owner.toString() !== user
   ) {
      throw new Error("Unauthorized", 403)
   }
}

function validateSwapState(swap, expectedState) {
   if (swap.status !== expectedState) {
      throw new Error("Invalid swap state", 400);
   }
}
function validateUserRole(swap, userId, role) {
   const isOwner = swap.owner.toString() === userId;
   const isRequester = swap.requester.toString() === userId;
   if (role === "requester" && !isRequester) {
      throw new Error("Only requester can perform this action", 403);
   }
   if (role === "owner" && !isOwner) {
      throw new Error("Only owner can perform this action", 403);
   }
}
async function updateBothListingFromSwapId(swapId, updateDetails) {
   const { requesterListing, ownerListing } = await getSwapByIdService(swapId)
   await listingModel.findByIdAndUpdate(requesterListing, updateDetails)
   await listingModel.findByIdAndUpdate(ownerListing, updateDetails)
   return { requesterListing, ownerListing }
}
async function checkBothListingAreElligibleToSwap(swapId) {
   const { requesterListing, ownerListing } = await getSwapByIdService(swapId)
   const requester = await listingModel.findById(requesterListing)
   const owner = await listingModel.findById(ownerListing)
   if (requester.isAvailable && owner.isAvailable && !requester.isLocked && !owner.isLocked) {
      return true
   }
   return false
}
module.exports = { updateBothListingFromSwapId,checkBothListingAreElligibleToSwap, getSwapByIdService, validateSwapState, validateUserRole, ValidateSwap }