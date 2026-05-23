
const spaceModel = require("../../models/space.model");
const listingModel = require("../../models/space.model");
const swapModel = require("../../models/swap/swap.model");


async function isListingLocked(listingId) {
    const isBeingSwapped = await swapModel.exists({
        $or: [
            { requesterListing: listingId },
            { ownerListing: listingId }
        ],
        status: {
            $in: ["accepted", "shipped"]
        }
    }).lean();
    return !!isBeingSwapped;
}



/*
 * @param {object} ListingData - contains all the required data for creating a listing
 * @returns {object} - the newly created listing
 * @description Creates a new listing in db and throws the error to controller if any happens
 */
async function createSpaceService(SpaceData) {
    try {
        const newSpace = await spaceModel.create(SpaceData);
        return newSpace;
    } catch (error) {
        console.log("Error creating space:", error);
        throw error;
    }
}
/*
 * @param {string} listingId - the id of the listing to be updated
 * @param {object} updateData - the data to be updated in the listing
 * @param {string} userId - the id of the user who is updating the listing
 * @returns {object} - the updated listing
 * @description Updates a listing in db if the user is the owner of the listing and throws the error to controller if any happens
 */
async function updateListingService(listingId, updateData, userId) {
    try {

        const isBeingSwapped = await isListingLocked(listingId);
        if (isBeingSwapped) throw new Error("Cannot update listing that is currently being swapped");
        const updatedListing = await listingModel.findOneAndUpdate(
            { _id: listingId, owner: userId },
            updateData,
            {
                returnDocument: "after"
            }
        ).lean();
        if (!updatedListing) throw new Error("Listing not found or unauthorized", 403);
        return updatedListing;
    } catch (error) {
        console.error("Error updating listing:", error);
        throw error;
    }
}

/*
* @returns {object} - the deleted listing
* @description Deletes a listing from db if the user is the owner of the listing and throws the error to controller if any happens
*/
async function deleteListingService(listingId, userId) {
    try {
        const isBeingSwapped = await isListingLocked(listingId);
        if (isBeingSwapped) throw new Error("Cannot delete listing that is currently being swapped");
        const deletedListing = await listingModel.findOneAndDelete({ _id: listingId, owner: userId }).lean();
        if (!deletedListing) throw new Error("Listing not found or unauthorized");
        return deletedListing;
    } catch (error) {
        throw error;
    }
}


/*
 * @param {string} listingId - the id of the listing to be fetched
 * @returns {object} - the listing
 * @description Fetches a specific listing from the database
 */
async function getListingByIdService(listingId) {
    try {
        const listing = await listingModel.findById(listingId).populate("owner").lean();
        return listing;
    } catch (error) {
        console.log("Error fetching listing:", error);
        throw error;
    }
}

/*
 * @returns {object[]} - an array of all listings in the database
 * @description Fetches all listings from the database and returns them in a paginated format (default 10 per page) to avoid performance issues.
 * @throws Throws the error to controller if any happens
 */
async function getAllSpacesService(filters, isAdmin = false) {
    try {
        const { capacity, spaceType, pricing, amenities, sortBy, page, search, lat, lng } = filters
        let query = {};
        if (!isAdmin) {
            query = {
                isAvailable: true,
                isLocked: false,
                isRemoved: false
            }
        }
        let skip = 0;
        // Capacity filter
        if (capacity && capacity !== "") {
            query.capacity = { $gte: capacity };
        }
        if (lat && lng) {
            query["location.geo"] = {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(lng), parseFloat(lat)],
                        10 / 6378.1,
                    ],
                },
            };
        }
        // Types filter (match any)
        if (amenities && amenities.length > 0) {
            query.amenities = { $in: amenities };
        }

        // spaceType filter
        if (spaceType && spaceType !== "") {
            query.spaceType = spaceType;
        }

        // Price filter
        if (pricing && pricing.rate) {
            query = {
                ...query,
                "pricing.rate": { $lte: pricing.rate }
            };
        }
        if (pricing && pricing.interval) {
            query = {
                ...query,
                "pricing.interval": pricing.interval
            };
        }
        if (page && page > 1) {
            const limit = 10;
            const skip = (parseInt(page || 1) - 1) * limit;
        }
        // Sorting
        let sortOption = {};
        if (sortBy === "newest") {
            sortOption.createdAt = -1;
        } else if (sortBy === "oldest") {
            sortOption.createdAt = 1;
        }
        else if (sortBy === "price-high") {
            sortOption.pricing.rate = -1;
        } else if (sortBy === "price-low") {
            sortOption.pricing.rate = 1;
        }
        if (search && search != "") {
            query.title = {
                $regex: search,
                $options: "i"
            }
        }
        const spaces = await spaceModel.find(query).sort(sortOption).skip(skip).limit(10).populate({ path: "owner", select: "username profilePicture rating" }).lean();
        const totalPages = Math.ceil((await spaceModel.countDocuments(query)) / 10);
        return { spaces, totalPages };
    } catch (error) {
        console.log("Error fetching listing:", error);
        throw error;

    }
}


module.exports = {
    createSpaceService,
    updateListingService,
    deleteListingService,
    getListingByIdService,
    getAllSpacesService
};