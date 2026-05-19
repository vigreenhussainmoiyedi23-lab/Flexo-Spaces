require("dotenv").config();
const { getDataFromToken, setCookie, signToken } = require("../utils/jsonwebtoken");
const { AuthOtpService, VerifyOtpService, resendOtpService } = require("../services/auth/Otp.service");
const { LoginService, RegisterService } = require("../services/auth/auth.service");
const redis = require("../config/cache");
const userModel = require("../models/user/user.model");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//hey if u are the code reviewer i just want to let you know 
// i have a habit of adding comments so better check comments before 
// reading any logic 
//full flow down here 
/* 
Auth Controller Flow (Hussain)
Login:
- validate user
- verify password
- generate + send OTP
- hash & store OTP
- set cookies + token

Register:
- check existing user
- create/update user
- hash password
- send OTP
- store hashed OTP

verify otp comments
    - first check if user with the email exists
    - than check the otp entered is correct
    - than set cookies and sign token 
    - lastly give response and without user's password      
*/

//Google 
const googleLoginHandler = async (req, res) => {
    const { credential } = req.body; // ID token from frontend
    if (!credential) return res.status(400).json({ error: 'No credential provided' });

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid token');

        // Example user data from Google
        let user = {
            googleId: payload.sub,
            email: payload.email,
            username: payload.name,
            profilePicture: payload.picture,
            isEmailVerified: true,
            isGoogleAuthenticated: true
        };

        // TODO: Find or create user in your database using googleId or email
        const existingUser = await userModel.findOne({ googleId: user.googleId });
        if (existingUser) {
            user = existingUser;
        } else {
            user = await userModel.create(user);
            user.isEmailVerified = true
            user.isRegistered = true
            await user.save();
        }

        // Issue your own JWT
        const token = signToken(user._id);
        setCookie(res, "token", token );
        const userWithoutConfidentialData = user.toObject();
        delete userWithoutConfidentialData.googleId
        res.json({
            success: true,
            user: userWithoutConfidentialData,
        });
    } catch (error) {
        console.error('Google token verification failed:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
}

// 🔐 Logout
const logoutHandler = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" })
        const decoded = getDataFromToken(token); // Decodes without verifying signature
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const secondsRemaining = decoded.exp - currentTimeInSeconds;
        redis.set(token, Date.now().toString(), "EX", secondsRemaining)
        res.clearCookie("token")
        res.status(200).json({ message: "Logout Done Successful!", success: true })
    } catch (error) {
        res.status(500).json({ message: "Error logging out", success: false })
    }
};

// 🔍 Check Auth
const getMeHandler = async (req, res) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(200).json({ message: "User is not Logged In", user: null, loggedIn: false });
        }
        const { id } = getDataFromToken(token);
        if (!id) {
            return res.status(200).json({ message: "User is not Logged In", user: null, loggedIn: false });
        }
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(200).json({ message: "User is not Logged In", user: null, loggedIn: false });
        }
        const deletePasswordAndOtp = user.toObject();
        delete deletePasswordAndOtp.password;
        delete deletePasswordAndOtp.otp;

        return res.status(200).json({ message: "User is Logged In", loggedIn: true, user: deletePasswordAndOtp });
    } catch (error) {
        return res.status(error?.status || 500).json({ message: error.message || "Error checking authentication", success: false });
    }
};

// 🔑 Login
const loginHandler = async (req, res) => {
    console.log("Login Handler Called", req.body)
    const { email, password } = req.body
    const user = await LoginService(email, password)
    if (!user) {
        return res.status(400).json({ message: "Incorrect Credentials", success: false })
    }
    await AuthOtpService(user)

    const userWithoutConfidentialData = user.toObject()
    delete userWithoutConfidentialData.password
    delete userWithoutConfidentialData.otp


    const tokenEmail = signToken(user.email)
    setCookie(res, "tokenEmail", tokenEmail)

    res.status(200).json({
        user: userWithoutConfidentialData,
        message: "Authentication done Successfully,Verification left",
        success: true,
    })
};

// 📝 Register
const registerHandler = async (req, res) => {
    const { username, email, password } = req.body
    const { user, success, message } = await RegisterService(email, password, username)
    if (!user || !success) return res.status(400).json({ message, success, user })

    await AuthOtpService(user)

    const userWithoutConfidentialData = user.toObject()
    delete userWithoutConfidentialData.password
    delete userWithoutConfidentialData.otp

    const tokenEmail = signToken(user.email, "10m")
    setCookie(res, "tokenEmail", tokenEmail)
    res.status(201).json({
        user: userWithoutConfidentialData,
        message,
        success,
    })
}

// ✅ Verify OTP
const verifyOtpHandler = async (req, res) => {
    const decoded = getDataFromToken(req.cookies.tokenEmail)
    const { otp } = req.body
    const { user, message, success } = await VerifyOtpService(decoded.id, otp)
    if (!user || !success) return res.status(400).json({ message, success, user })

    const token = signToken(user._id)
    setCookie(res, "token", token)
    res.status(201).json({
        user,
        message,
        success
    })
}
const resendOtpHandler = async (req, res) => {
    const email = getDataFromToken(req.cookies.tokenEmail).id
    const { user, message, success } = await resendOtpService(email)
    if (!user || !success) return res.status(400).json({ message, success, user })
    const token = signToken(user._id)
    setCookie(res, "token", token)
    res.status(201).json({
        user,
        message,
        success
    })
}

module.exports = {
    loginHandler,
    registerHandler,
    verifyOtpHandler,
    logoutHandler,
    getMeHandler,
    resendOtpHandler,
    googleLoginHandler
};