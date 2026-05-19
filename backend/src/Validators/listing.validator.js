const { CLOTHING_TYPES, SIZES, CONDITIONS, CATEGORIES } = require("../constants/listingEnums");
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
    body("clothingType")
        .notEmpty()
        .withMessage("clothingType cannot be empty"),
    body("brandName").notEmpty().withMessage("brandName cannot be empty"),
    body("size")
        .notEmpty()
        .withMessage("size cannot be empty")
        .matches(/^(XS|S|M|L|XL|XXL|XXL\+)$/i)
        .withMessage("size must be one of XS, S, M, L, XL, XXL, XXL+"),
    body("condition")
        .notEmpty()
        .withMessage("condition cannot be empty")
        .matches(/^(new|like_new|good|fair|poor)$/i)
        .withMessage("condition must be one of new, like_new, good, fair, poor"),

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

    body("category")
        .optional()
        .isIn(CATEGORIES).withMessage("Invalid category"),

    body("size")
        .optional()
        .isIn(SIZES).withMessage("Invalid size"),

    body("condition")
        .optional()
        .isIn(CONDITIONS).withMessage("Invalid condition"),

    body("brandName")
        .optional()
        .isString().withMessage("Brand name must be a string"),

    body("estimatedValue")
        .not()
        .exists()
        .withMessage("Estimated value cannot be updated manually"),

    body("clothingType")
        .optional()
        .custom((value, { req }) => {
            const category = req.body.category;

            if (!category) {
                throw new Error("Category is required when updating clothing type");
            }

            const validTypes = CLOTHING_TYPES[category] || [];

            if (!validTypes.includes(value)) {
                throw new Error("Invalid clothing type for category");
            }

            return true;
        }),

    body("images")
        .not()
        .exists()
        .withMessage("Images cannot be updated through this endpoint. Use the dedicated endpoints for adding or removing images."),
];

module.exports = { createListingValidator, updateListingValidator }