import axios from "axios";

const BASE_URL = "http://localhost:8080/auth";

export const login = async (authvals) => {
  try {
    const url = `${BASE_URL}/login`;
    const res = await axios.post(
      url,
      {
        email: authvals.email,
        password: authvals.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("login res", res.data);
    return res.data;
  } catch (err) {
    if (err.response?.data?.error) {
      handleError(err.response.data.error.details[0].message);
    } else {
      handleError(err.response?.data?.message || "Login failed.");
    }
  }
};
export const signup = async (authvals) => {
  try {
    const url = `${BASE_URL}/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authvals),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    handleError("An error occurred. Please try again.");
  }
};
export const updatePass = async (user) => {
  try {
    console.log("options", user);
    const url = `${BASE_URL}/update-password`;
    const res = await axios.post(url, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    handleError("An error occurred. Please try again.");
  }
};

export const userExites = async (email) => {
  try {
    const url = `${BASE_URL}/user-exist`;
    const res = await axios.post(
      url,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    handleError("An error occurred. Please try again.");
  }
};
