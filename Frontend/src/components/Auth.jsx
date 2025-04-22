import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed, CheckCircle, SendHorizonal } from "lucide-react";
import { handleError, handleSuccess } from "../assets/helper/utils";
import { sendOtp, verifyOtp } from "../assets/helper/otp";
import { login, signup, updatePass, userExites } from "../assets/helper/login";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);

  const [authvals, setAuthVals] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthVals({ ...authvals, [name]: value });
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await login(authvals);
        if (res.success) {
          handleSuccess("Login Successful");
          localStorage.setItem("token", res.jwtToken);
          localStorage.setItem("loggedInUser", res.name);
          localStorage.setItem("email", res.email);
          navigate("/dashboard");
        }
      } else {
        const res = await signup(authvals);
        if (res.success) {
          handleSuccess("Sign Up Successful");

          setAuthVals({ name: "", email: "", password: "" });
          setOtp("");
          setNewPassword("");
          setIsLogin(true);
        } else {
          handleError(res.message || "Signup failed.");
        }
      }
    } catch (err) {
      handleError("Something went wrong.");
    }
  };

  const sendOtpHandler = async (flag) => {
    console.log(flag);
    try {
      if (flag == 1) {
        const res = await userExites(authvals.email);
        if (res.success) {
          handleSuccess("User already exists, please login.");
          return;
        }
      }

      const res = await sendOtp(authvals.email);
      if (res.success) {
        handleSuccess("OTP sent to your email");
        setSentOtp(true);
        setOtpCountdown(60);
      } else {
        handleError(res.message || "Failed to send OTP");
      }
    } catch {
      handleError("Failed to send OTP");
    }
  };

  const OtpChangeHandle = async (e) => {
    const { value } = e.target;
    setOtp(value);
    if (value.length === 6) {
      try {
        const res = await verifyOtp(authvals.email, value);
        if (res.success) {
          handleSuccess("OTP verified successfully");
          setOtpVerified(true);
          setNewPassword("");
        } else {
          handleError("Invalid OTP.");
        }
      } catch {
        handleError("Error verifying OTP.");
      }
    }
  };

  const resetPasswordHandler = async () => {
    try {
      const res = await updatePass({
        email: authvals.email,
        password: newpassword,
      });
      if (res.success) {
        handleSuccess(res.message);
        setForgetPassword(false);
        setSentOtp(false);
        setOtpVerified(false);
        setAuthVals({ name: "", email: "", password: "" });
        setOtp("");
        setNewPassword("");
      } else {
        handleError(res.message);
      }
    } catch {
      handleError("Error resetting password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          {forgetPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={submitHandle}>
          {!isLogin && !forgetPassword && (
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={authvals.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={authvals.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {forgetPassword && sentOtp && (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={OtpChangeHandle}
                  className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {otpVerified && (
                  <span className="absolute inset-y-0 right-3 flex items-center text-green-500">
                    <CheckCircle size={20} />
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  name="password"
                  value={newpassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    handleChange(e);
                  }}
                  className="w-full p-3 pr-12 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white"
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </button>
              </div>
            </>
          )}

          {!forgetPassword && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={authvals.password}
                onChange={handleChange}
                className="w-full p-3 pr-12 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          )}

          {/* OTP button in signup */}
          {!isLogin && !forgetPassword && (
            <>
              {sentOtp && (
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={OtpChangeHandle}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {otpVerified && (
                    <span className="absolute inset-y-0 right-3 flex items-center text-green-500">
                      <CheckCircle size={20} />
                    </span>
                  )}
                </div>
              )}
              <button
                type="button"
                disabled={otpCountdown > 0}
                onClick={() => sendOtpHandler(1)}
                className={`w-full flex justify-center items-center gap-2 p-3 font-semibold text-white rounded-lg ${
                  otpCountdown > 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Send OTP"}
              </button>
            </>
          )}

          {forgetPassword ? (
            <button
              type="button"
              onClick={
                sentOtp
                  ? resetPasswordHandler
                  : () => {
                      sendOtpHandler(0);
                    }
              }
              // disabled={!sentOtp || !otpVerified}
              className="w-full p-3 font-semibold rounded-lg 
                  bg-blue-600 hover:bg-blue-700 text-white"
            >
              {sentOtp ? "Reset Password" : "Send OTP"}
            </button>
          ) : isLogin ? (
            <button
              type="submit"
              className="w-full p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          ) : (
            <button
              type="submit"
              disabled={!otpVerified}
              className={`w-full p-3 font-semibold rounded-lg ${
                !otpVerified
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Sign Up
            </button>
          )}
        </form>

        {/* Forgot password link */}
        {isLogin && (
          <p className="text-center text-gray-400">
            <button
              className="text-blue-400 hover:underline"
              onClick={() => setForgetPassword(!forgetPassword)}
            >
              {forgetPassword ? "Back to Login" : "Forgot Password?"}
            </button>
          </p>
        )}

        {/* Toggle login/signup */}
        {!forgetPassword && (
          <p className="text-center text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:underline ml-1"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        )}

        {/* OTP info */}
        {forgetPassword && (
          <p className="text-center text-gray-400">
            {sentOtp
              ? "An OTP has been sent to your email."
              : "An OTP will be sent to your email."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
