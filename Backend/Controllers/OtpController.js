const sendOtpEmail = require("../Helpers/mailer");
const OtpModal = require("../Modals/Otp");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await OtpModal.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }
    await OtpModal.deleteMany({ email });
    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

gentrateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};
const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = gentrateOtp();
  try {
    await OtpModal.deleteMany({ email });
    await OtpModal.create({ email, otp });
    await sendOtpEmail(email, otp);
    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true, data: otp });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  verifyOtp,
  sendOtp,
};
