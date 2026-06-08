
const spaceModel = require("../../models/space.model");





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
 * @param {string} spaceId - the id of the space to be updated
 * @param {object} updateData - the data to be updated in the space
 * @param {string} userId - the id of the user who is updating the space
 * @returns {object} - the updated space
 * @description Updates a space in db if the user is the owner of the space and throws the error to controller if any happens
 */
async function updateListingService(spaceId, updateData, userId) {
    try {
        const updatedSpace = await spaceModel.findOneAndUpdate(
            { _id: spaceId, owner: userId },
            updateData,
            {
                returnDocument: "after"
            }
        ).lean();
        if (!updatedSpace) throw new Error("Space not found or unauthorized", 403);
        return updatedSpace;
    } catch (error) {
        console.error("Error updating space:", error);
        throw error;
    }
}

/*
* @returns {object} - the deleted space
* @description Deletes a space from db if the user is the owner of the space and throws the error to controller if any happens
*/
async function deleteSpaceService(spaceId, userId) {
    try {
        const deletedSpace = await spaceModel.findOneAndDelete({ _id: spaceId, owner: userId }).lean();
        if (!deletedSpace) throw new Error("Space not found or unauthorized");
        return deletedSpace;
    } catch (error) {
        throw error;
    }
}


/*
 * @param {string} spaceId - the id of the space to be fetched
 * @returns {object} - the space
 * @description Fetches a specific space from the database
 */
async function GetSpaceByIdService(spaceId) {
    try {
        const space = await spaceModel.findById(spaceId).populate("owner").lean();
        return space;
    } catch (error) {
        console.log("Error fetching space:", error);
        throw error;
    }
}

/*
 * @returns {object[]} - an array of all spaces in the database
 * @description Fetches all spaces from the database and returns them in a paginated format (default 10 per page) to avoid performance issues.
 * @throws Throws the error to controller if any happens
 */
async function getAllSpacesService(filters, isAdmin = false) {
    try {
        const { capacity, spaceType, pricing, amenities, sortBy, page, search, lat, lng } = filters
        let query = {};
        console.log(sortBy)
        if (!isAdmin) {
            query = {
                isAvailable: true,
                isLocked: false,
                isRemoved: false
            }
        }
        let skip = 0;
        if (capacity && capacity.length === 2) {
            query.capacity = {};
            if (capacity[0] || capacity[0] === 0) {
                query.capacity.$gte = Number(capacity[0]);
            }
            if (capacity[1]) {
                query.capacity.$lte = Number(capacity[1]);
            }
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
            query.amenities = { $all: amenities };
        }

        // spaceType filter
        if (spaceType && spaceType !== "all") {
            query.spaceType = spaceType;
        }

        // Price filter
        if (pricing && pricing.rate) {
            if (pricing.rate[0] || pricing.rate[0] === 0) {
                query["pricing.rate"] = { ...query["pricing.rate"], $gte: Number(pricing.rate[0]) };
            }
            if (pricing.rate[1]) {
                query["pricing.rate"] = { ...query["pricing.rate"], $lte: Number(pricing.rate[1]) };
            }
        }
        if (pricing && pricing.interval !== "all") {
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
        } else if (sortBy === "capacity-high") {
            sortOption.capacity = -1;
        } else if (sortBy === "price-high") {
            sortOption["pricing.rate"] = -1;
        } else if (sortBy === "price-low") {
            sortOption["pricing.rate"] = 1;
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
    deleteSpaceService,
    GetSpaceByIdService,
    getAllSpacesService
};