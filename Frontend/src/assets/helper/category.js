import axios from "axios";
import { handleError, handleSuccess } from "./utils";

const BASE_URL = "http://localhost:8080/category";

export const getAllCategory = async () => {
  try {
    const response = await axios.get(BASE_URL);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return "";
  }
};

export const categoryById = async (id) => {
  const url = `${BASE_URL}/${id}`;
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return "";
  }
};
export const categoryInsert = async (categoryData) => {
  console.log(categoryData, "-----cd");
  try {
    const res = await axios.post(BASE_URL, categoryData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = res;
    console.log(data);
    if (data.success) {
      console.log(data, "------inside success");

      console.log(data);

      return data;
    }
  } catch (err) {
    console.log(err);
  }
};
