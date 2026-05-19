const bcrypt = require("bcryptjs")

function HashString(string) {
    try {
        const hashesString = bcrypt.hash(string, 10)
        return hashesString
    } catch (error) {
        return res.status(500).json({ message: "Error hashing String" })
    }
}
function CompareStringAndHash(PlainTextString, HashString) {
    try {
        const result = bcrypt.compare(PlainTextString, HashString)
        if (!result) return false
        return result
    } catch (error) {
        return res.status(500).json({ message: "Error hahsing password" })
    }
}

module.exports = { HashString, CompareStringAndHash }