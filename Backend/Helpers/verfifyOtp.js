// verifyOtp.js
import { getOTP, deleteOTP } from "./otpStore.js";

export function verifyOTP(email, userOtp) {
  const storedOtp = getOTP(email);
  if (storedOtp && storedOtp === userOtp) {
    deleteOTP(email);
    return true;
  }
  return false;
}
