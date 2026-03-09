import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["x-auth-token"] = token;
  return headers;
};

export const addFooterImage = async (payload) => {
  try {
    const res = await axios.post(`${BaseUrl}/footerImages/add`, payload, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error adding footer image:", error);
    throw error;
  }
};

export const updateFooterImage = async (id, payload) => {
  try {
    const res = await axios.put(
      `${BaseUrl}/footerImages/update?id=${id}`,
      payload,
      {
        headers: getHeaders(),
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating footer image:", error);
    throw error;
  }
};

export const getAllFooterImages = async () => {
  try {
    const res = await axios.get(`${BaseUrl}/footerImages/getAll`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching footer images:", error);
    throw error;
  }
};

export const deleteFooterImage = async (id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/footerImages/delete?id=${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting footer image:", error);
    throw error;
  }
};
