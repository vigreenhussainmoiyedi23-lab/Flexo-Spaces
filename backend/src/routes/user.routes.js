const { Router } = require("express")
const { GetUserDataHandler, GetUserListingsHandler, GetNotificationsHandler, GetRecentSwapsHandler, updateProfile, GetUserRatingHandler } = require("../controllers/user.controller.js")
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware.js")
const upload = require("../config/multer.js")
const router = Router()

router.get("/data/:userId", GetUserDataHandler)
router.get("/listings/:userId", GetUserListingsHandler)
router.get("/ratings/:userId", GetUserRatingHandler)
router.get("/notifications", isAuthenticated, GetNotificationsHandler)
router.get("/recentSwaps/:owner", GetRecentSwapsHandler)
router.put("/profile", upload.single("profilePicture"), isAuthenticated, updateProfile);
module.exports = router