const { Router } = require("express")
const { getChatAllMessagesHandler, chatAccessHandler, getUserAllChatsHandler } = require("../controllers/chat.controller")
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")
const router = Router()
const upload = require("../config/multer")
const imagekit = require("../config/imagekit")
const { uploadImage } = require("../services/listing/UploadImage.service")
router.get("/", isAuthenticated, getUserAllChatsHandler)
router.get("/:chatId", isAuthenticated, getChatAllMessagesHandler)
router.post("/", isAuthenticated, chatAccessHandler)


router.post("/uploadImages", upload.array("files"), async (req, res) => {
    try {
        const files = req.files;
        if (!files) return res.status(400).json({ message: "No files uploaded" });
        const urls = [];
        const promises = files.map((file) =>
            uploadImage(file.buffer, file.originalname, "SwapStyle/chat")
        )
        const responses = await Promise.all(promises)

        for (const response of responses) {
            urls.push({ url: response.url, fileId: response.fileId });
        }

        res.status(200).json({ urls, responses });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
});

module.exports = router