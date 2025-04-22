import axios from "axios";

const BASE_URL = "http://localhost:8080/auth/privacy-auth";
export const privacyVerf = async (user) => {
  console.log("options", user);
  try {
    const res = await axios.post(BASE_URL, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error verifying:", error);
    return null;
  }
};
