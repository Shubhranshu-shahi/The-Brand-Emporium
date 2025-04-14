// otpStore.js
const otpStore = {};

function setOTP(email, otp, ttl = 15 * 60 * 1000) {
  otpStore[email] = { otp, expiresAt: Date.now() + ttl };

  // Auto-remove after expiry
  setTimeout(() => {
    delete otpStore[email];
  }, ttl);
}

function getOTP(email) {
  const record = otpStore[email];
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return null;
  }

  return record.otp;
}

function deleteOTP(email) {
  delete otpStore[email];
}

export { setOTP, getOTP, deleteOTP };
