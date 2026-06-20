const generateOTP = require("../utils/otpGenerator");

const { sendOTPEmail } = require("../services/emailServices");
const otpStore = {};
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();
    otpStore[email] = otp;
    console.log("Email:", email);
    console.log("OTP:", otp);

    await sendOTPEmail(email, otp);

    console.log("Email sent successfully");

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];

    return res.json({
      success: true,
      message: "OTP verified",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
};
