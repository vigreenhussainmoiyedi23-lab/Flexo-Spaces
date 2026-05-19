/*
APIs to build for listing.routes.js:

1. GET    /api/listings           - Get all listings
2. GET    /api/listings/:id       - Get a single listing by ID
3. GET    /api/listings/user/:userId - Get all listings by a specific user

4. PUT    /api/listings/:id       - Update a listing by ID

5. POST   /api/listings           - Create a new listing
6. POST   /api/listings/:id/images   - Add images to a listing

7. DELETE /api/listings/:id/images/:imageId - Remove an image from a listing
8. DELETE /api/listings/:id       - Delete a listing by ID
    */

const imagekit = require("../config/imagekit");
const { validateLocation } = require("../Validators/locationValidator");
const { EstimateValue } = require("../services/ai/ValueEstimate.service");
const { getAllListingsService, getListingByIdService, getUserAllListingsService, createListingService, updateListingService, deleteListingService } = require("../services/listing/DBFunctions.service");
const { deleteAllImageFromListing } = require("../services/listing/DeleteImage.service");
const { uploadImage } = require("../services/listing/UploadImage.service");


async function GetAllListingsHandler(req, res) {
    try {
        const filters = req.body;
        const { listings, totalPages } = await getAllListingsService(filters);
        res.status(200).json({ listings, totalPages, message: "Listings fetched successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching listings", success: false })
    }
}

async function GetListingByIdHandler(req, res) {
    const { id } = req.params;
    try {
        const listing = await getListingByIdService(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found", success: false });
        }
        res.status(200).json({ listing, message: "Listing fetched successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching listing", success: false });
    }
}



async function UpdateListingByIdHandler(req, res) {
    const { id } = req.params;
    try {
        const updatedListing = await updateListingService(id, req.body, req.userId);
        res.status(200).json({ listing: updatedListing, message: "Listing updated successfully", success: true });
    } catch (error) {
        res.status(error?.status || 500).json({ message: error.message, success: false, redirectTo: "/listings" });
    }
}

async function CreateListingHandler(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image is required",
                success: false
            });
        }
        const { category, clothingType, brandName, size, condition, title, description } = req.body;
        const estimatedValue = await EstimateValue({ brandName, size, clothingType, condition });
        let { city, state, country, lat, lng } = await validateLocation(JSON.parse(req.body.location))
        const location = {
            geo: {
                coordinates: [lng, lat]
            },
            city,
            state,
            country
        }
 
        const value = estimatedValue
        if (!value) return res.status(500).json({ message: "Error estimating value", success: false })
        const owner = req.userId
        const promises = req.files.map(file =>
            uploadImage(file.buffer, Date.now() + "_" + Math.floor(Math.random() * 1000), "/SwapStyle/listingImages")
        );
        console.log("checkpoint middle")
        const responses = await Promise.all(promises)
        const images = responses.map(response => { return { url: response.url, fileId: response.fileId, thumbnail: response.thumbnailUrl } })
        const listing = await createListingService({ location: location, clothingType, brandName, size, condition, estimatedValue: value, images, owner, title, description, category })
        console.log("checkpoint middle")
        res.status(201).json({ listing, message: "Listing created successfully", success: true })

    } catch (error) {
        return res.status(500).json({ message: "Error creating listing", error, success: false })
    }
}
async function AddImagesToListingHandler(req, res) {

}

async function RemoveImageFromListingHandler(req, res) { }
async function DeleteListingByIdHandler(req, res) {


    const { id } = req.params;
    let deletedListing
    try {
        deletedListing = await deleteListingService(id, req.userId);
    } catch (error) {
        return res.status(400).json({ message: "Error listing not found or unauthorized", error, success: false });
    }

    try {
        await deleteAllImageFromListing(deletedListing);

    } catch (error) {
        console.error("Error deleting images from ImageKit:", error);
        return res.status(500).json({ message: "Error deleting images from ImageKit", error, success: false });
    }
    res.status(200).json({ message: "Listing deleted successfully", success: true });

}



module.exports = {
    CreateListingHandler,
    GetAllListingsHandler,
    GetListingByIdHandler,
    UpdateListingByIdHandler,
    AddImagesToListingHandler,
    RemoveImageFromListingHandler,
    DeleteListingByIdHandler
}