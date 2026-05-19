const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vigreenhussainmoiyedi23@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
    },
});

module.exports={transporter} 