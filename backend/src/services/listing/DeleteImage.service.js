const imagekit = require("../../config/imagekit");
const listingModel = require("../../models/listing.model");

async function deleteImageFromListing(imageId, listingId) {
    try {
        // Find the listing by ID
        const listing = await listingModel.findById(listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Find the image by ID
        const image = listing.images.find(img => img.fileId === imageId);
        if (!image) {
            throw new Error("Image not found");
        }
        // Delete the image from ImageKit
        await imagekit.files.delete(image.fileId);

        const newImages = listing.images.filter(img => img.fileId !== imageId);
        listing.images = newImages;
        await listing.save();

        return { success: true };
    } catch (error) {
        console.error("Error deleting image from listing:", error);
        throw new Error("Error deleting image");
    }
}
async function deleteAllImageFromListing(Deletedlisting, listingId) {
    try {
        // Find the listing by ID
        const listing = Deletedlisting || await listingModel.findById(listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Find the image by ID
        const images = listing.images.map(img => img.fileId)
        if (!images) {
            throw new Error("Image not found");
        }

        // Delete the image from ImageKit
        await imagekit.files.bulk.delete({ fileIds: images });
        try {

            listing.images = [];
            await listing.save();
        } catch (error) {
            return { success: false };
        }
        return { success: true };
    } catch (error) {
        console.error("Error deleting image from listing:", error);
        throw new Error("Error deleting image");
    }
}

module.exports = { deleteImageFromListing, deleteAllImageFromListing };