const redis = require("../config/cache")
const userModel = require("../models/user/user.model")
const { getDataFromToken } = require("../utils/jsonwebtoken")

async function isAdmin(req, res, next) {
    console.log("reqached middleware start")
    console.log("reqached middleware start")
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" })
    }
    const istokenBlackListed = await redis.get(token)
    if (istokenBlackListed) {
        return res.status(403).json({ message: "Forbidden: Token is blacklisted" })
    }
    // Verify the token (pseudo-code)
    console.log("here is the middle")
    try {
        // return the user id from the token and attach it to the request object
        const { id } = await getDataFromToken(token)
        const user = await userModel.findById(id).select("role")
        console.log("user found", user.role)
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: User is not an admin" })
        }
        req.userId = id
        next()
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" })
    }
}


module.exports = {
    isAdmin
}