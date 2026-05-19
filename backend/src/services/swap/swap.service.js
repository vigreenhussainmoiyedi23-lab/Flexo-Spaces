const swapModel = require("../../models/swap/swap.model")

async function createSwapService(ownerListing, requesterListing, message, user) {
   try {
      // both the listings involved in the swap must exist
      if (!ownerListing || !requesterListing) {
         return { message: "Listing not found", success: false, swap: null }
      }

      if (ownerListing.owner._id.toString() === user) {
         return { message: "Cannot swap your own listing", success: false, swap: null }
      }
      // swaprequester should not be the owner 
      if (requesterListing.owner._id.toString() !== user) {
         return { message: "Unauthorized", success: false, swap: null }
      }
      const swapRequestAlreadyExists = await swapModel.findOne({
         $or: [

            {
               requesterListing: requesterListing._id,
               ownerListing: ownerListing._id
            },

            {
               requesterListing: ownerListing._id,
               ownerListing: requesterListing._id
            }
         ],
         status: { $in: ["pending", "accepted"] } // important
      });
      if (swapRequestAlreadyExists) {
         return {
            message: "Swap request already exists",
            success: false,
            swap: null
         }
      }
      const swap = await swapModel.create({
         requester: user,
         owner: ownerListing.owner,
         ownerListing: ownerListing._id,// the listing of the owner or the listing user asks for
         requesterListing: requesterListing._id, // the listing offered by the user
         message,
         status: "pending"
      })
      return {
         success: true,
         swap: swap.toObject(),
         message: "Swap request created"
      }
   } catch (error) {
      throw new Error(error)
   }
}
const getTrackingLink = (courier, trackingId) => {
   if (!trackingId) return null;

   switch (courier) {
      case "delhivery":
         return `https://www.delhivery.com/track/package/${trackingId}`;

      case "bluedart":
         return `https://www.bluedart.com/tracking?awb=${trackingId}`;

      case "dtdc":
         return `https://www.dtdc.in/tracking.asp?strCnno=${trackingId}`;

      case "indiapost":
         return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignment=${trackingId}`;

      case "ekart":
         return `https://ekartlogistics.com/shipmenttrack/${trackingId}`;

      case "xpressbees":
         return `https://www.xpressbees.com/track?awb=${trackingId}`;

      case "amazon":
         return `https://www.amazon.in/progress-tracker/package/ref=ppx_yo_dt_b_track_package?trackingId=${trackingId}`;

      case "flipkart":
         return `https://www.flipkart.com/order_details?trackingId=${trackingId}`;

      case "other":
      default:
         return `https://www.google.com/search?q=${encodeURIComponent(
            courier + " tracking " + trackingId
         )}`;
   }
};
module.exports = { createSwapService, getTrackingLink }

/*  
Swap Services Documentation - Hussain
--> createSwapService
   - handles full swap creation logic
   - validates listings existence, ownership and prevents self-swaps
   - creates a new swap with initial PENDING state and saves to db


--> getUserSwapsService
   - fetches all swaps related to a user
   - supports filtering (sent / received / both)
   - builds query and returns list of swaps


--> getSingleSwapService
   - fetches a specific swap by id
   - ensures swap exists and user is part of it
   - used for secure swap detail access


--> acceptSwapService
   - handles accepting a swap request
   - validates that only owner can accept and status is PENDING
   - updates swap status to ACCEPTED


--> rejectSwapService
   - handles rejecting a swap request
   - ensures only owner can reject and swap is still PENDING
   - updates status to REJECTED


--> cancelSwapService
   - allows requester to cancel a swap
   - validates requester role and ensures swap is still PENDING
   - updates status to CANCELLED


--> completeSwapService
   - marks a swap as completed after successful exchange
   - ensures swap is ACCEPTED and user is part of the swap
   - updates status to COMPLETED


--> shipmentDetailsService
   - handles adding shipment details for a swap
   - validates user participation in swap
   - pushes courier and tracking info into shipment array


--> getSwapByIdService (utility)
   - reusable function to fetch swap by id
   - throws error if swap not found
   - used across multiple services to avoid duplication


--> validateSwapAccess (utility)
   - checks if user is either requester or owner of swap
   - prevents unauthorized access to swap data
   - used in multiple services for security


--> validateSwapState (utility)
   - ensures swap is in expected state before action
   - prevents invalid transitions (like complete before accept)
   - centralizes state validation logic

*/