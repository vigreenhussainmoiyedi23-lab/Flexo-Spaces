const { CLOTHING_TYPES, SIZES, CONDITIONS, CATEGORIES } = require("../constants/listingEnums");
const { body } = require("express-validator");
const { validate } = require("./validate");


const createDisputeValidator = [
    body("description")
        .notEmpty()
        .withMessage("description cannot be empty")
        .isLength({ min: 5 })
        .withMessage("description must be at least 5 characters long"),
    body("reason")
        .notEmpty()
        .withMessage("reason cannot be empty"),
    body("type")
        .notEmpty()
        .withMessage("size cannot be empty")
        .matches(/^(NOT_SHIPPED|WRONG_ITEM|DAMAGED_ITEM|FRAUD|OTHER)$/i)
        .withMessage("type must be one of NOT_SHIPPED WRONG_ITEM DAMAGED_ITEM FRAUD OTHER"),
]


module.exports = { createDisputeValidator }