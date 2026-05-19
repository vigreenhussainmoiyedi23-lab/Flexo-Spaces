const { body, validationResult } = require("express-validator")

const authValidator = [
    body("email")
        .notEmpty()
        .withMessage("email cannot be empty")
        .isEmail()
        .withMessage("invalid email format"),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage("password must be 6 characters long"),
    body('username')
        .optional()
        .isLength({ min: 6 })
        .withMessage("username must be 6 characters long")
]



module.exports = { authValidator }