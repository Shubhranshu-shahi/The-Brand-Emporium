const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `The-Brand-Emporum <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; width: 100%; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333333; text-align: center;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #555555; text-align: center;">Hello!</p>
          <p style="font-size: 16px; color: #555555; text-align: center;">We received a request to reset your password. Please use the OTP code below to proceed:</p>
          
          <div style="background-color: #007bff; color: white; padding: 15px; font-size: 20px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px;">
            ${otp}
          </div>

          <p style="font-size: 16px; color: #555555; text-align: center;">The OTP will expire in 15 minutes. If you didn't request this, you can ignore this message.</p>
          <p style="font-size: 16px; color: #555555; text-align: center;">Thank you for using our service!</p>
        </div>
        <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888888;">
            <p style="margin: 0;">The-Brand-Emporium</p>
          <p>If you did not request this email, please ignore it.</p>
        </footer>
      </div>
    `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
};

module.exports = sendOtpEmail;
