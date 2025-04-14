// sendOtp.js
import nodemailer from "nodemailer";
import { setOTP } from "./otpStore.js";

export async function sendOTPToEmail(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  setOTP(email, otp); // store in memory

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 15 minutes.</p>`,
  });
}
