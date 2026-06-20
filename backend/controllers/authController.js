const generateOTP = require("../utils/otpGenerator");
const { sendOTPEmail } = require("../services/emailServices");
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const otpStore = {};

// ==================== CHECK USER ====================

const checkUser = async (req, res) => {
  try {
    const { email } = req.body;

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    console.log("CHECK USER ERROR:", error);
    console.log("CHECK USER DATA:", data);
    if (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const existingUser = data.users.find((user) => user.email === email);

    if (existingUser) {
      return res.json({
        success: false,
        message: "user already exist",
      });
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== SEND OTP ====================

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();

    otpStore[email] = otp;

    console.log("Email:", email);
    console.log("OTP:", otp);

    await sendOTPEmail(email, otp);

    console.log("Email sent successfully");

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== VERIFY OTP ====================

const verifyOTP = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  sendOTP,
  verifyOTP,
  checkUser,
};
