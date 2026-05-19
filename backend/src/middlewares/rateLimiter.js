const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per window
    message: {
        success: false,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,  // disable X-RateLimit-*
});
const OtpLimiter = rateLimit({
    windowMs: 2.5 * 60 * 1000, // 2.5 minutes
    max: 10, // limit each IP to 10 requests per window
    message: {
        success: false,
        message: "Too many requests, please try again after few seconds."
    },
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,  // disable X-RateLimit-*
});
const ResendOtpLimiter = rateLimit({
    windowMs: 2.5 * 60 * 1000, // 2.5 minutes
    max: 1, // limit each IP to 10 requests per window
    message: {
        success: false,
        message: "Too many requests, please try again after few seconds."
    },
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,  // disable X-RateLimit-*
});
const CreateListingLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // limit each IP to 2 requests per window
    message: {
        success: false,
        message: "Too many requests, please try again after few seconds."
    },
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,  // disable X-RateLimit-*
});
module.exports = { authLimiter,OtpLimiter,ResendOtpLimiter,CreateListingLimiter }