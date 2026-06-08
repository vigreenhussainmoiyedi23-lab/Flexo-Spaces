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
const { getAllSpacesService, updateListingService, createSpaceService, GetSpaceByIdService, deleteSpaceService } = require("../services/space/DBFunctions.service");
const { deleteAllImageFromSpace } = require("../services/space/DeleteImage.service");
const { uploadImage } = require("../services/space/UploadImage.service");


async function GetAllSpacesHandler(req, res) {
    try {
        const filters = req.body;
        console.log(filters);
        
        const { spaces, totalPages } = await getAllSpacesService(filters);
        res.status(200).json({ spaces, totalPages, message: "spaces fetched successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching spaces", success: false })
    }
}


async function GetSpaceByIdHandler(req, res) {
    const { id } = req.params;
    try {
        const Space = await GetSpaceByIdService(id);
        if (!Space) {
            return res.status(404).json({ message: "Space not found", success: false });
        }
        res.status(200).json({ Space, message: "Space fetched successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching Space", success: false });
    }
}



async function UpdateListingByIdHandler(req, res) {
    const { id } = req.params;
    try {
        const updatedSpace = await updateListingService(id, req.body, req.userId);

        res.status(200).json({ space: updatedSpace, message: "Space updated successfully", success: true });
    } catch (error) {
        res.status(error?.status || 500).json({ message: error.message, success: false, redirectTo: "/spaces" });
    }
}

async function CreateWorkSpaceHandler(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image is required",
                success: false
            });
        }
        if (req.role == "user") return res.status(403).json({ message: "Unauthorized", success: false });
        const { pricing, spaceType, capacity, amenities, title, description } = req.body;

        let { city, state, country, lat, lng } = await validateLocation(JSON.parse(req.body.location))
        const location = {
            geo: {
                coordinates: [lng, lat]
            },
            city,
            state,
            country
        }

        const owner = req.userId
        const promises = req.files.map(file =>
            uploadImage(file.buffer, Date.now() + "_" + Math.floor(Math.random() * 1000), "/SwapStyle/listingImages")
        );

        const responses = await Promise.all(promises)
        const images = responses.map(response => { return { url: response.url, fileId: response.fileId, thumbnail: response.thumbnailUrl } })
        console.log(req.body, images)
        const listing = await createSpaceService({
            location: location,
            spaceType,
            pricing,
            capacity,
            images,
            owner,
            title,
            description,
            amenities
        })
        res.status(201).json({ listing, message: "WorkSpace created successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Error creating WorkSpace", error, success: false })
    }
}
async function DeleteSpaceByIdHandler(req, res) {


    const { id } = req.params;
    let deletedSpace
    try {
        deletedSpace = await deleteSpaceService(id, req.userId);
    } catch (error) {
        return res.status(400).json({ message: "Error space not found or unauthorized", error, success: false });
    }

    try {
        await deleteAllImageFromSpace(deletedSpace);

    } catch (error) {
        console.error("Error deleting images from ImageKit:", error);
        return res.status(500).json({ message: "Error deleting images from ImageKit", error, success: false });
    }
    res.status(200).json({ message: "Space deleted successfully", success: true });

}



module.exports = {
    CreateWorkSpaceHandler,
    GetAllSpacesHandler,
    GetSpaceByIdHandler,
    UpdateListingByIdHandler,
    DeleteSpaceByIdHandler,
}