import axios from "axios";
import { handleError, handleSuccess } from "./utils";

const BASE_URL = "http://localhost:8080/customer";

export const customerByPhone = async (phone) => {
  const url = `${BASE_URL}/${phone}`;
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return "";
  }
};
export const customerInsert = async (customerData) => {
  try {
    const res = await axios.post(BASE_URL, customerData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = res;
    console.log(data);
    if (data.success) {
      console.log(data, "------inside success");

      console.log(data);
      handleSuccess(data.message);
      return data;
    }
  } catch (err) {
    console.log(err);
    handleError(err?.response?.data?.message);
  }
};
