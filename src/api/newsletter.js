import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get token safely
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getNewsLetter = async () => {
  try {
    const token = getAuthToken();
    const headers = {};

    if (token) {
      headers["x-auth-token"] = token;
    }

    const res = await axios.get(`${BaseUrl}/newsletter/getAllNewsLetter`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching newsletter", error);
    throw error;
  }
};
