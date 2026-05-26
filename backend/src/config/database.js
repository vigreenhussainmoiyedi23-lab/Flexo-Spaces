const mongoose = require("mongoose")
const agenda = require("./agenda")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB");

        await agenda.start()
        console.log("Agenda started and connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB: OR Agenda", error)
    }
}

module.exports = connectDB