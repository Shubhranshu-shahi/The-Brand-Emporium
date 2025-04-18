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
    // console.log(response.data.data, "----invoice api");
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
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

export const invoiceDelete = async (id) => {
  try {
    const url = `${BASE_URL}/${id}`;
    const response = await axios.delete(url);
    handleSuccess(response.data.message);
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

export const fetchInvoicesByInvoiceNumbers = async (invoiceNumbers) => {
  const url = `${BASE_URL}/invoice-numbers`;

  // console.log(invoiceNumbers, " : from api");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ invoiceNumbers }),
    });

    const json = await res.json();
    const returnData = JSON.stringify({ json });
    return json.data || [];
    // return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const SearchInvoiceByProductId = async (selectedProduct) => {
  const url = `${BASE_URL}/product-id`;

  // console.log(invoiceNumbers, " : from api");
  try {
    console.log("hello from api ");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedProduct }),
    });

    const json = await res.json();
    const returnData = JSON.stringify({ json });
    return json.data || [];
    // return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateInvoice = async (id, data) => {
  try {
    const url = `${BASE_URL}/${id}`;
    console.log(url, " : from api");
    console.log(data, " : from api");
    console.log(id, " : from api");

    const res = await axios.put(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to update invoice:", err);
    return null;
  }
};
