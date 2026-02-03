import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get token safely
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getPaymentHistory = async (params) => {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.isType) queryParams.append("isType", params.isType);

    const queryString = queryParams.toString();
    // let url = `${BaseUrl}/payment/getAllPaymentHistory?page=${page}&limit=${limit}`;
    // if (isType) {
    //     url += `&isType=${isType}`;
    // }

    const url = `${BaseUrl}/payment/getAllPaymentHistory${queryString ? `?${queryString}` : ""}`;

    const res = await axios.get(url, { headers });
    return res.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

export const downloadInvoice = async (paymentData) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/payment/createInvoice`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": getAuthToken(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    throw error;
  }
};
