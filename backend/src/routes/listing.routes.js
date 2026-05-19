/*
APIs to build for listing.routes.js:

1. GET    /api/listings           - Get all listings
2. GET    /api/listings/:id       - Get a single listing by ID
3. GET    /api/listings/:userId/user - Get all listings by a specific user

4. PUT    /api/listings/:id       - Update a listing by ID

5. POST   /api/listings           - Create a new listing
6. POST   /api/listings/:id/images   - Add images to a listing

7. DELETE /api/listings/:id/images/:imageId - Remove an image from a listing
8. DELETE /api/listings/:id       - Delete a listing by ID
    */

const express = require("express")
const router = express.Router()
const { CreateListingHandler, GetAllListingsHandler, GetListingByIdHandler, GetListingsByUserIdHandler, UpdateListingByIdHandler, AddImagesToListingHandler, RemoveImageFromListingHandler, DeleteListingByIdHandler } = require("../controllers/listing.controller")
const { isAuthenticated } = require("../middlewares/protectedRoutes.middleware")
const upload = require("../config/multer")
const { createListingValidator, updateListingValidator } = require("../Validators/listing.validator")
const { validate } = require("../Validators/validate")
const { CreateListingLimiter } = require("../middlewares/rateLimiter")


router.post("/get-all", GetAllListingsHandler)
router.get("/:id", GetListingByIdHandler)
// router.get("/:userId/user", isAuthenticated, GetListingsByUserIdHandler)


router.post("/",CreateListingLimiter, upload.array("images", 4), createListingValidator, validate, isAuthenticated, CreateListingHandler)
router.patch("/:id", isAuthenticated,updateListingValidator,validate, UpdateListingByIdHandler)
router.delete("/:id", isAuthenticated, DeleteListingByIdHandler)




module.exports = router