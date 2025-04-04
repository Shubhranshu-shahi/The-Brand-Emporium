import axios from "axios";
import { handleError, handleSuccess } from "./utils";

const BASE_URL = "http://localhost:8080/invoice";
export const invoiceInsert = async (invoiceData) => {
  console.log("options", invoiceData);

  try {
    const res = await axios.post(BASE_URL, invoiceData, {
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

  //   console.log(err);

  //   handleError(err?.response?.data?.message);
  //   console.log(err?.response?.data?.message);
};

export const invoiceGenrate = async (id) => {
  const url = `${BASE_URL}/${id}`;
  try {
    const response = await axios.get(url);
    console.log(response.data.data, "----invoice api");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return err.message;
  }
};

export const getAllInvoice = async () => {
    try {
        const res = await axios.get(BASE_URL);
        console.log(res.data.data);
        return res.data.data;
    } catch(err) {
        console.log(err);
        return err.message;
    }
}
