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

export const getAllCenters = async () => {
  try {
    const res = await axios.get(`${BaseUrl}/center/getAllCenter`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching centers:", error);
    throw error;
  }
};

export const createBanner = async (
  imageFile,
  isOnboarding,
  isBanner,
  isWhoWeare = false,
) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("isOnboarding", isOnboarding.toString());
    formData.append("isBanner", isBanner.toString());
    formData.append("isWhoWeare", isWhoWeare.toString());

    const res = await axios.post(
      `${BaseUrl}/banner/createNewBanner`,
      formData,
      {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

export const updateBanner = async (id, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await axios.put(
      `${BaseUrl}/banner/updateBanner?id=${id}`,
      formData,
      {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const getAllBanners = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${BaseUrl}/banner/getBanner`, {
      headers: getHeaders(),
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/banner/deleteBanner?id=${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

export const updateOnboardingStatus = async (isActive) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/banner/updateOnboarding`,
      {},
      {
        params: { isActive },
        headers: getHeaders(),
      },
    );

    return {
      success: response.data?.success ?? true,
      message:
        response.data?.message || "Onboarding status updated successfully",
    };
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to update onboarding status",
    };
  }
};
