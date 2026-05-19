const express = require("express")
const authRouter = express.Router()
// Middlewares  and Controllers ⚙️
const { validate } = require("../Validators/validate")
const { authValidator } = require("../Validators/auth.validator");
const { authLimiter, OtpLimiter, ResendOtpLimiter } = require("../middlewares/rateLimiter");
const { logoutHandler, loginHandler, registerHandler, verifyOtpHandler, resendOtpHandler, getMeHandler, googleLoginHandler } = require("../controllers/auth.controller");
const { loginDummyHandler, registerDummyHandler } = require("../controllers/developementDummyControllers/auth.controller");


/* - Get -"/api/auth"
   - checks if user is logged in or not 
   - and returns true if loggedIn / false on loggedOut
   - is not a middleware but a method for frontend UI/UX */
authRouter.get("/get-me", getMeHandler)


/* -Get-/api/auth/logout
   -To logout the user if he/she presses logout */
authRouter.get("/logout", logoutHandler)

if (process.env.NODE_ENV === "development") {
   //  routes for testing purposes
   authRouter.post("/login", loginDummyHandler)
   authRouter.post("/register", registerDummyHandler)
} else {
   /* -Post-/api/auth/login
   -To login the user if he/she enters the credentials correctly*/
   authRouter.post("/login",authValidator,validate, loginHandler)
   /* -Post-/api/auth/register
   -To register the user if he/she doesn't already exists*/
   authRouter.post("/register",  authValidator, validate, registerHandler)
}


/* - Post - /api/auth/verify-otp
- to check otp entered by the user and check if he is verified to access the user routes 
- if he enters wrong otp four times we say too many attemmpts try again later
- else he can wait for 2 minutes and or resend the otp */
authRouter.post("/verify-otp", OtpLimiter, verifyOtpHandler)
authRouter.post("/resend-otp", ResendOtpLimiter, resendOtpHandler)
authRouter.post("/forgot-password", authLimiter, authValidator, validate, loginHandler)


/* Sheriyans-160 cohort 2.0 ke baad hi banaunga */
authRouter.post("/google",googleLoginHandler)

module.exports = authRouter