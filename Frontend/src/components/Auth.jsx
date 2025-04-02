import React, { useState } from "react";
import "../assets/css/auth.css";
import { Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { handleError, handleSuccess } from "../assets/helper/utils";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [authvals, setAuthVals] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const [pathName, setPathName] = useState(false)
  // const location = useLocation();
  // const { pathname } = location;

  //for forms value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyAuthvals = { ...authvals };
    copyAuthvals[name] = value;
    setAuthVals(copyAuthvals);
    console.log(authvals);
  };
  //navigate
  const navigate = useNavigate();
  // for submiting the form to the db
  const submitHandle = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const url = "http://localhost:8080/auth/login";

        const res = await axios.post(url, {
          email: authvals.email,
          password: authvals.password,
        });
        console.log(res);
        if (res.data.success) {
          handleSuccess("Login Successfull");
          localStorage.setItem("token", res.data.jwtToken);
          localStorage.setItem('loggedInUser', res.data.name);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (err) {
        if (err.response.data.hasOwnProperty("error")) {
          
          console.log(err.response.data.error?.details[0].message);
          handleError(err.response.data.error?.details[0].message);
        } else {
          console.log(err.response.data);

          handleError(err.response.data.message);
        }
        
      }
    } else {
      try {
        const url = "http://localhost:8080/auth/signup";
        // const res = await axios.post(url, authvals);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authvals),
        });
        const result = await response.json();
        const { success, message, error } = result;
        if (success) {
          console.log(result);
          handleSuccess("Sign Up Successfull");
        } else if (error) {
          const details = error?.details[0].message;
          handleError(details);
        } else if (!success) {
          handleError(message);
        }
        
      } catch (err) {
        console.log(err);
        handleError(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white " >
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={submitHandle}>
          {!isLogin && (
            <input
              type="text"
              onChange={handleChange}
              name="name"
              placeholder="Username"
              value={authvals.name}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={authvals.email}
            required
            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={authvals.password}
            required
            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="w-full p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            type="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline ml-1"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
