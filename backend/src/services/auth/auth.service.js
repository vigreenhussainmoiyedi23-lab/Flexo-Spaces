const { findUserByEmail, createUser } = require("../user/user.service")
const { CompareStringAndHash, HashString } = require("./bcrypt.service")

async function LoginService(email, password) {
    const user = await findUserByEmail(email)
    if (!user || !user?.isRegistered) return false


    const result = await CompareStringAndHash(password, user.password)
    if (!result) return false
    return user
}

async function RegisterService(email, password, username) {
    const userExists = await findUserByEmail(email)
    if (userExists && userExists?.isRegistered) {
        return { message: "User Already exists with this email", success: false, user: null }
    }

    const hashedPassword = await HashString(password)
    let user = userExists
    if (!userExists) {
        user = await createUser({
            username,
            email,
            password: hashedPassword,

        })
    }

    return {
        user,
        message: "Authenticated successfully! verification left",
        success: true,
    }
}

module.exports = { LoginService, RegisterService }