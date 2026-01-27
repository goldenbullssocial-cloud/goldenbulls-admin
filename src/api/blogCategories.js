import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Get all blog categories
export const getAllBlogCategory = async (params) => {
  try {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/blogCategory/getAllBlogCategory`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
};

// Create blog category
export const createBlogCategory = async (data) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(
      `${API_BASE_URL}/blogCategory/addBlogCategory`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating blog category:", error);
    throw error;
  }
};

// Update blog category
export const updateBlogCategory = async (id, data) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(
      `${API_BASE_URL}/blogCategory/updateBlogCategoty?id=${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating blog category:", error);
    throw error;
  }
};

// Delete blog category
export const deleteBlogCategory = async (id) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/blogCategory/deleteBlogCategory?id=${id}`,
      {
        headers: {
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw error;
  }
};
