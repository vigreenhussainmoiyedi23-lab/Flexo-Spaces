const redis = require("../config/cache")
const { getDataFromToken } = require("../utils/jsonwebtoken")
const userModel = require("../models/user/user.model.js")
async function isAuthenticated(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" })
    }
    const istokenBlackListed = await redis.get(token)
    if (istokenBlackListed) {
        return res.status(403).json({ message: "Forbidden: Token is blacklisted" })
    }
    // Verify the token (pseudo-code)
    try {
        // return the user id from the token and attach it to the request object
        const { id } = await getDataFromToken(token)
        const user = await userModel.findById(id).select("role")
        req.userId = id
        req.userRole = user.role
        next()
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" })
    }
}


module.exports = {
    isAuthenticated
}