import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const { loading } = useContext(AuthContext);
  const { verifyUserOtpHandler, resendOtpHandler } = useAuth();
  const [error, setError] = useState(null);
  // Auto-focus next input
  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1); // Allow only one digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current is filled
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const digits = pastedData.split("").filter((char) => /^[0-9]$/.test(char));

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 4) newOtp[i] = digit;
      });
      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 3);
      inputRefs.current[nextIndex].focus();
    }
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const otpValue = otp.join("");
      verifyUserOtpHandler(otpValue);
      navigate("/listings");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 w-full flex items-center justify-center">
      {/* Right Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex rounded-4xl items-center justify-center p-8 bg-bg-main">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-6xl playfair font-bold text-brand-900 mb-2">
              Verify OTP
            </h2>
            <p className="text-text-secondary">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-center text-3xl font-semibold border-2 border-[#e5e7eb] 
                           rounded-2xl focus:border-[#00d492] focus:outline-none 
                           transition-all duration-200 bg-white text-[#0b2c3d]"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={otp.join("").length !== 4 || loading}
              className="w-full py-4 bg-[#00d492] hover:bg-[#00b87a] disabled:bg-[#a3e6c8] 
                       text-[#0f1a14] font-semibold text-lg rounded-2xl transition-all duration-200
                       disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-red-600 font-medium source-code-pro">
                {error?`⚠️ ${error}`:""}
            </p>
            {/* Resend Option */}
            <div className="text-center">
              <p className="text-[#6b7280] text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-brand-900 hover:underline font-medium"
                  onClick={resendOtpHandler}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
