const bookingModel = require("../../models/booking/booking.model");
const spaceModel = require("../../models/space.model");

async function createBookingService({ user, spaceId, fromDateTime, toDateTime, seatsBooked, fullName, notes, availability }, req) {
   try {
      // remaining seats after this booking
      // totalCapacitySnapshot
      // remainingCapacitySnapshot

      const space = await spaceModel.findById(spaceId)
      if (!space) {
         throw new Error("Space not found")
      }
      if (fromDateTime < new Date()) {
         throw new Error("Cannot book for past date and time")
      }


      const bookingType = space.pricing.interval
      const bookedBy = user
      const owner = space.owner
      const resource = space.spaceType
      const totalCapacitySnapshot = Number(space.capacity)
      const remainingCapacitySnapshot = availability.availableSeats - seatsBooked
      const basePrice = calculateBookingPrice({
         rate: space.pricing.rate,
         interval: space.pricing.interval,
         seatsBooked,
         totalCapacity: totalCapacitySnapshot,
         fromDateTime,
         toDateTime
      })
      const workspaceSnapshot = {
         title: space.title,
         city: space.location.city,
         state: space.location.state,
         country: space.location.country,
         selectedAmenities: space.amenities,
      }

      const booking = await bookingModel.create({
         fromDateTime,
         endDateTime: toDateTime,
         seatsBooked,
         expiresAt: fromDateTime + (24 * 60 * 60 * 1000),
         fullName,
         notes,
         bookingType,
         bookedBy,
         owner,
         resource,
         totalCapacitySnapshot,
         remainingCapacitySnapshot,
         space: spaceId,
         workspaceSnapshot,
         pricing: { basePrice, platformFee: Number((basePrice * 0.1).toFixed(2)), finalPrice: Number((basePrice * 1.1).toFixed(2)) }
      })

      return {
         success: true,
         booking,
         message: "booking request created"
      }
   } catch (error) {
      throw new Error(error)
   }
}

async function getAvailabilityService({ spaceId, fromDate, fromTime, toDate, toTime, fromDateTime, endDateTime }) {
   console.log(fromDateTime, endDateTime)
   try {
      if (!fromDateTime && !endDateTime) {
         if (!fromDate || !fromTime || !toDate || !toTime) {
            throw new Error("Either fromDateTime and endDateTime or fromDate, fromTime, toDate, toTime must be provided")
         }
      }
      let startDateTime, toDateTime
      if (fromDateTime && endDateTime) {
         startDateTime = new Date(fromDateTime)
         toDateTime = new Date(endDateTime)
      } else {
         startDateTime = new Date(`${fromDate}T${fromTime}`)
         toDateTime = new Date(`${toDate}T${toTime}`)
      }
      const overlappingBookings =
         await bookingModel.find({

            space: spaceId,

            status: {
               $in: [
                  "accepted",
                  "payment_pending",
                  "confirmed",
                  "checked_in"
               ]
            },

            fromDateTime: {
               $lt: toDateTime
            },

            endDateTime: {
               $gt: startDateTime
            }

         }).select("seatsBooked fromDateTime endDateTime")
            .lean();

      const space = await spaceModel
         .findById(spaceId)
         .select("capacity")
         .lean();
      const bookedSeats =
         overlappingBookings.reduce(
            (acc, booking) =>
               acc + booking.seatsBooked,
            0
         );
      const availableSeats =
         Math.max(
            0,
            space.capacity - bookedSeats
         );
      return {
         success: true,
         availableSeats,
         overlappingBookings
      }

   } catch (error) {
      throw new Error(error)
   }
}
function calculateBookingPrice({
   rate,
   interval,
   seatsBooked,
   totalCapacity,
   fromDateTime,
   toDateTime,
}) {

   const seatRate =
      rate / totalCapacity;

   const durationMs =
      toDateTime - fromDateTime;

   const durationHours =
      durationMs / (1000 * 60 * 60);

   const durationDays =
      durationMs / (1000 * 60 * 60 * 24);

   let multiplier = 1;

   switch (interval) {

      case "hourly":
         multiplier = Math.ceil(durationHours);
         break;

      case "daily":
         multiplier = Math.ceil(durationDays);
         break;

      case "weekly":
         multiplier =
            Math.ceil(durationDays / 7);
         break;

      case "monthly":
         multiplier =
            Math.ceil(durationDays / 30);
         break;

      default:
         multiplier = 1;
   }

   const basePrice =
      Number((seatRate *
         seatsBooked *
         multiplier).toFixed(2));

   return Math.round(basePrice);
}

function isOverlapping(a, b) {
   return (
      a.fromDateTime < b.endDateTime &&
      a.endDateTime > b.fromDateTime
   );
}
function isCompatible(a, b) {
   // compatible = NOT overlapping
   return !isOverlapping(a, b) || a.remainingCapacitySnapshot >= b.seatsBooked;
}

async function generateAlternatives(currentBooking, bookings) {
   const currentPrice = currentBooking.pricing.finalPrice;

   let singleBetter = [];
   let combinations = [];

   // 1. Singles (better revenue than current)
   for (let b of bookings) {
      if (b.pricing.finalPrice > currentPrice) {
         singleBetter.push({
            bookings: [b],
            revenue: b.pricing.finalPrice
         });
      }
   }

   // 2. Pair combinations (non-overlapping only)
   for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
         const a = bookings[i];
         const b = bookings[j];

         if (isCompatible(a, b)) {
            combinations.push({
               bookings: [a, b],
               revenue: a.pricing.finalPrice + b.pricing.finalPrice
            });
         }
      }
   }

   // 3. Sort by best revenue (optional but useful)
   singleBetter.sort((x, y) => y.revenue - x.revenue);
   combinations.sort((x, y) => y.revenue - x.revenue);

   return {
      singleBetter,
      combinations
   };
}

async function genearateConsequence(currentBooking, bookings) {
   let consequences = []
   bookings.map(b => {
      if (currentBooking.remainingCapacitySnapshot < b.seatsBooked) {
         consequences.push({
            booking: [b],
            revenue: b.pricing.finalPrice
         })
      }
   })
   return consequences
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
module.exports = { createBookingService, genearateConsequence, generateAlternatives, getTrackingLink, getAvailabilityService, calculateBookingPrice }

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