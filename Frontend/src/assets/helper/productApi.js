import axios from "axios";
import { handleError, handleSuccess } from "./utils";

const BASE_URl = "http://localhost:8080/products";
export const getAllProduct = async () => {
  try {
    const res = await axios.get(BASE_URl);
    if (res.data.success) {
      console.log(res.data);
      return res.data.data;
      // console.log(res.data);
      // handleSuccess(res.data.message);
    } else {
      handleError(res.data.message);
    }
  } catch (err) {
    handleError(err);
    console.log(err);
  }
};
export const productInsert = async (productdata) => {
  console.log("options", productdata);

  //   try {
  await axios
    .post(BASE_URl, productdata, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((resp) => {
      const { data } = resp;
      if (data.success) {
        handleSuccess(data.message);
      }
      console.log("its success", data.message);
    })
    .catch((err) => {
      handleError(err?.response?.data?.message);
    });
};
export const productById = async (id) => {
  const url = `${BASE_URl}/${id}`;

  try {
    const response = await axios.get(url);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const productDelete = async (id) => {
  try {
    const url = `${BASE_URl}/${id}`;
    const response = await axios.delete(url);
    handleSuccess(response.data.message);
  } catch (error) {
    console.error("Error deleting product:", error);
    handleError(error?.response?.data?.message);
  }
};

export const productUpdate = async (id, productData) => {
  console.log("options", productData);
  console.log("options", id);
  const url = `${BASE_URl}/${id}`;
  try {
    const response = await axios.put(url, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      return response.data;
    } else {
      handleError(response.data.message);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    handleError(error?.response?.data?.message);
  }
};
