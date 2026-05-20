const { toFile } = require("@imagekit/nodejs/index.js");
const imagekit = require("../../config/imagekit");
const sharp = require("sharp")


// try {
//    const result = await uploadImage(...);
// } catch (error) {
//    res.status(500).json({ message: error.message });
// }  use this service as this in controller to handle errors properly
async function uploadImage(fileBuffer, filename, foldername) {
    try {
        const compressedBuffer = await sharp(fileBuffer)
            .resize({ width: 800 })        // optional: max width 800px
            .jpeg({ quality: 70 })         // reduce quality to 70%
            .toBuffer();

        const response = await imagekit.files.upload({
            file: await toFile(compressedBuffer, filename),
            fileName: filename,
            folder: foldername
        });
        return response; // ✅ return data (URL, fileId, etc.)
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // ✅ let controller decide what to do
    }
}


module.exports = { uploadImage }