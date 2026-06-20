const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTPEmail = async (email, otp) => {
  await apiInstance.sendTransacEmail({
    sender: {
      email: "abinavm2907@gmail.com",
      name: "PrepPilot",
    },
    to: [{ email }],
    subject: "PrepPilot OTP Verification",
    htmlContent: `
      <h2>Your OTP is:</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `,
  });
};

module.exports = { sendOTPEmail };
