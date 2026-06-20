const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  checkUser,
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/check-user", checkUser);

module.exports = router;
