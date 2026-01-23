import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getAllCoupon = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coupon/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(
      `${API_BASE_URL}/coupon/add`,
      couponData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(
      `${API_BASE_URL}/coupon/edit/${id}`,
      couponData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/coupon/delete/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting bot:", error);
    throw error;
  }
};
