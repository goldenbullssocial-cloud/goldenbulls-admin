import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getAllYoutube = async (params) => {
  try {
    const queryString = new URLSearchParams();
    if (params?.page) queryString.append("page", params.page);
    if (params?.limit) queryString.append("limit", params.limit);
    if (params?.search) queryString.append("search", params.search);

    const url = queryString.toString()
      ? `${API_BASE_URL}/youtube/getAllYoutube?${queryString.toString()}`
      : `${API_BASE_URL}/youtube/getAllYoutube`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching youtube videos:", error);
    throw error;
  }
};

export const getCategoryDropdown = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/dropdown`);
    return response.data;
  } catch (error) {
    console.error("Error fetching algo bots:", error);
    throw error;
  }
};

export const createYoutube = async (categoryData) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(
      `${API_BASE_URL}/youtube/createNewYouTube`,
      categoryData,
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

export const updateYoutube = async (id, formData) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(
      `${API_BASE_URL}/youtube/updateYouTube?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        timeout: 30000,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteYoutube = async (id) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/youtube/deleteYoutube?id=${id}`,
      {
        headers: {
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
