const { findUserByEmail, createUser } = require("../../services/user/user.service")
const bcrypt = require("bcryptjs")
const { signToken, setCookie } = require("../../utils/jsonwebtoken")
async function loginDummyHandler(req, res) {
    const { email, password } = req.body
    let user = await findUserByEmail(email)
    if (!user) return res.status(400).json({ message: "Incorrect Credentials", success: false })
    const ispasswordCorrect = await bcrypt.compare(password, user.password)
    if (!ispasswordCorrect) return res.status(400).json({ message: "Incorrect Credentials", success: false })

    const token = signToken(user._id)
    setCookie(res, "token", token)
    res.status(201).json({ message: "Authentication done Successfully,Verification left", success: true })
}
async function registerDummyHandler(req, res) {
    const { email, password, username } = req.body
    let userExists = await findUserByEmail(email)
    if (userExists) return res.status(400).json({ message: "User already with this email exists", success: false })
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser({
        username,
        email,
        password: hashedPassword,
        isEmailVerified: true
    })
    const token = signToken(user._id)
    setCookie(res, "token", token)
    res.status(201).json({ message: "Authentication done Successfully,Verification left", success: true })

}

module.exports = { loginDummyHandler, registerDummyHandler }