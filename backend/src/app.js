const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const authRouter = require("./routes/auth.routes")
const listingRouter = require("./routes/listing.routes")
const swapRouter = require("./routes/swap.routes")
const userRouter = require("./routes/user.routes")
const chatRouter = require("./routes/chat.routes")
const AdminRouter = require("./routes/admin.routes")
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth", authRouter)
app.use("/api/listings", listingRouter)
app.use("/api/swaps", swapRouter)
app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/admin", AdminRouter)

// ✅ serve frontend
const distPath = path.join(__dirname, "../public")
app.use(express.static(distPath))
app.get("*name", (req, res) => {
    
    res.sendFile(path.join(distPath, "index.html"))
});
module.exports = app