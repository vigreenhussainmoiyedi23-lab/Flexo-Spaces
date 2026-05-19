const redis = require("../config/cache")
const { getDataFromToken } = require("../utils/jsonwebtoken")

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
        req.userId = id
        next()
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" })
    }
}


module.exports = {
    isAuthenticated
}