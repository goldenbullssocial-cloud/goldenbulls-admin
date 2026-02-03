import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    console.warn("Running on server, no access to localStorage");
    return null;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found in localStorage");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};
const getHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["x-auth-token"] = token;
  return headers;
};

export const getCustomers = async (params) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${BaseUrl}/user/get${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
export const updateCustomer = async (id, payload) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

    const res = await axios.put(`${BaseUrl}/user/update?id=${id}`, payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating customer", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const token = getAuthToken();
    const headers = getHeaders();

    if (token) {
      headers["x-auth-token"] = token;
    }

    const res = await axios.delete(`${BaseUrl}/user/deleteUser?id=${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting customer", error);
    throw error;
  }
};

export const setCustomerStatus = async (id, isActive) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

    const res = await axios.put(
      `${BaseUrl}/user/userStatus?id=${id}&isActive=${isActive}`,
      {},
      { headers },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating customer status", error);
    throw error;
  }
};

export const createCustomer = async (payload) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

    const res = await axios.post(`${BaseUrl}/user/signup`, payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating customer", error);
    throw error;
  }
};
