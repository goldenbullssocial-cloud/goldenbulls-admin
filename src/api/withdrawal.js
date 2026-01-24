import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthToken = () => {
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

export const getWithdrawals = async (query = {}) => {
  try {
    const { page = 1, limit = 10, search, status } = query;
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search) {
      params.append("search", search);
    }

    // Only append status if it's a valid status and not "all"
    if (status && status !== "all") {
      // Ensure the status is lowercase to match backend expectations
      params.append("status", status.toLowerCase());
    }

    const url = new URL(`${BaseUrl}/withdrawal/getAllRequest`);
    url.search = params.toString();

    console.log("API Request URL:", url.toString());

    const res = await axios.get(url.toString(), {
      headers: getHeaders(),
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch withdrawals",
      payload: {
        data: [],
        count: 0,
      },
    };
  }
};

export const updateWithdrawalStatus = async (id, data) => {
  try {
    const res = await axios.put(
      `${BaseUrl}/withdrawal/updateRequest?id=${id}`,
      data,
      { headers: getHeaders() },
    );

    return {
      success: true,
      message: "Withdrawal updated successfully",
      data: res.data.data,
    };
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update withdrawal",
    };
  }
};
