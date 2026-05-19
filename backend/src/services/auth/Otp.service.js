const { transporter } = require("../../config/nodeMailer");
const { findUserByEmail } = require("../user/user.service");
const { HashString, CompareStringAndHash } = require("./bcrypt.service");

async function sendOtp(otp, email) {
  const mailOptions = {
    from: 'vigreenhussainmoiyedi23@gmail.com',
    to: email,
    subject: 'Your OTP for SwapStyle',
    text: 'welcome to SwapStyle - your sustainable clothing exchange and here is your one-time-password',
    html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #111827; color: #ffffff; text-align: center; padding: 20px;">
      <h2 style="margin: 0;">SwapStyle</h2>
      <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">
        Sustainable Clothing Exchange
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 30px; text-align: center;">
      
      <h3 style="margin-bottom: 10px; color: #111827;">
        Your Verification Code
      </h3>
      
      <p style="color: #6b7280; font-size: 14px;">
        Use the OTP below to complete your authentication
      </p>

      <!-- OTP Box -->
      <div style="margin: 25px 0;">
        <span style="
          display: inline-block;
          background: #f3f4f6;
          padding: 15px 30px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          border-radius: 8px;
          color: #111827;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #6b7280; font-size: 13px;">
        This code will expire in <strong>10 minutes</strong>
      </p>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
        If you didn’t request this, you can safely ignore this email.
      </p>

    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} SwapStyle. All rights reserved.
    </div>

  </div>
              </div>`
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error occurred:', error.message);
    }
  });

}

async function CreateHashAndSendOtp(email) {
  try {
    const otp = (Math.floor(Math.random() * 9999) + "").toString().padStart(4, 0)
    await sendOtp(otp, email)
    const hashedOtp = await HashString(otp)
    return hashedOtp
  } catch (err) {
    return false
  }
}

async function AuthOtpService(user) {
  try {
    const hashedOtp = await CreateHashAndSendOtp(user.email)
    user.otp = hashedOtp
    user.isEmailVerified = false
    user.otpExpires = Date.now() + 10 * 60 * 1000
    await user.save()
  } catch (error) {
    console.error("Error in AuthOtpService:", error)
  }
}

async function VerifyOtpService(email, otp) {
  try {
    const user = await findUserByEmail(email)
    if (!user || !user.otp) {
      return { user: null, message: "Invalid Credentials", success: false }
    }
    if (Date.now() - user.otpExpires > 0) {
      return { user: null, message: "Otp expired ! resend it again", success: false }
    }

    const isOtpCorrect = await CompareStringAndHash(otp, user.otp)
    if (!isOtpCorrect) {
      return { user: null, message: "Invalid Otp", success: false }
    }

    user.isEmailVerified = true
    user.isRegistered = true
    user.otp = ""
    await user.save()

    const deletedPasswordUser = user.toObject()
    delete deletedPasswordUser.password
    delete deletedPasswordUser.otp
    return { user: deletedPasswordUser, message: "Welcome ! Authentication done Successfully", success: true }
  } catch (error) {
    console.error("Error in Verify OTP:", error)
  }
}
async function resendOtpService(email) {
  try {

    const user = await findUserByEmail(email)
    if (!user || !user.otp || user.otp == "") {
      return { user: null, message: "First login than try this", success: false }
    }

    user.isEmailVerified = false
    await AuthOtpService(user)
    await user.save()


    const deletedPasswordUser = user.toObject()
    delete deletedPasswordUser.password
    delete deletedPasswordUser.otp
    return {
      user: deletedPasswordUser,
      message: "resend otp successfully",
      success: true
    }
  } catch (error) {
    console.error("Error in Resend OTP:", error)
  }
}

module.exports = {
  sendOtp,
  AuthOtpService,
  VerifyOtpService,
  resendOtpService
}