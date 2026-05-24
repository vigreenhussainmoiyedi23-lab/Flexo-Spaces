const { SPACE_TYPES, PRICING_INTERVALS, AMENITY_LABELS } = require("../constants/workspaceEnums")
const { body } = require("express-validator")


const createListingValidator = [
    body("title")
        .notEmpty()
        .withMessage("title cannot be empty")
        .isLength({ min: 3 })
        .withMessage("title must be at least 3 characters long"),
    body("description")
        .notEmpty()
        .withMessage("description cannot be empty")
        .isLength({ min: 5 })
        .withMessage("description must be at least 5 characters long"),
    body("spaceType")
        .notEmpty()
        .withMessage("spaceType cannot be empty")
        .isIn(SPACE_TYPES)
        .withMessage("spaceType must be one of the following: " + SPACE_TYPES.join(", ")),
    body("capacity")
        .notEmpty().withMessage("capacity cannot be empty")
        .isNumeric().withMessage("capacity must contain only numbers"),
    body("pricing.rate")
        .notEmpty()
        .withMessage("pricing.rate cannot be empty")
        .isNumeric().withMessage("pricing.rate must contain only numbers"),
    body("pricing.interval")
        .notEmpty()
        .withMessage("pricing.interval cannot be empty")
        .isIn(PRICING_INTERVALS)
        .withMessage("pricing.interval must be one of the following: " + PRICING_INTERVALS.join(", ")),
    body("amenities")
        .notEmpty()
        .withMessage("amenities cannot be empty")
        .isArray().withMessage("amenities must be an array")
        .custom((value) => {
            const validAmenities = Object.keys(AMENITY_LABELS);
            const isValid = value.every((item) => validAmenities.includes(item));
            if (!isValid) {
                throw new Error("amenities must be one of the following: " + validAmenities.join(", "));
            }
            return true;
        }),

]

const updateListingValidator = [
    body("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

    body("spaceType")
        .notEmpty()
        .withMessage("spaceType cannot be empty")
        .isIn(SPACE_TYPES)
        .withMessage("spaceType must be one of the following: " + SPACE_TYPES.join(", ")),
    body("capacity")
        .notEmpty().withMessage("capacity cannot be empty")
        .isNumeric().withMessage("capacity must contain only numbers"),
    body("pricing.rate")
        .notEmpty()
        .withMessage("pricing.rate cannot be empty")
        .isNumeric().withMessage("pricing.rate must contain only numbers"),
    body("pricing.interval")
        .notEmpty()
        .withMessage("pricing.interval cannot be empty")
        .isIn(PRICING_INTERVALS)
        .withMessage("pricing.interval must be one of the following: " + PRICING_INTERVALS.join(", ")),
    body("amenities")
        .notEmpty()
        .withMessage("amenities cannot be empty")
        .isArray().withMessage("amenities must be an array")
        .custom((value) => {
            const validAmenities = Object.keys(AMENITY_LABELS);
            const isValid = value.every((item) => validAmenities.includes(item));
            if (!isValid) {
                throw new Error("amenities must be one of the following: " + validAmenities.join(", "));
            }
            return true;
        }),

    body("images")
        .not()
        .exists()
        .withMessage("Images cannot be updated through this endpoint. Use the dedicated endpoints for adding or removing images."),
];

module.exports = { createListingValidator, updateListingValidator }