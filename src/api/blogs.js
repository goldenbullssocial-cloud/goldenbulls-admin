import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Get all blogs
export const getAllBlog = async (params) => {
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
    const url = `${API_BASE_URL}/blog/getAllBlog?${queryString ? queryString : ""}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Create blog
export const createBlog = async (data) => {
  const token = getAuthToken();

  try {
    const response = await axios.post(`${API_BASE_URL}/blog/addBlog`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (id, data) => {
  const token = getAuthToken();

  try {
    const response = await axios.put(
      `${API_BASE_URL}/blog/updateBlog?id=${id}`,
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
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/blog/deleteBlog?id=${id}`,
      {
        headers: {
          "x-auth-token": token,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
