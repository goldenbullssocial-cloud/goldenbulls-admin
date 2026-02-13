import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get token safely
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

export const getCompletedCourseCertificate = async () => {
    try {
        const res = await axios.get(`${BaseUrl}/payment/getCompletedCourseCertificate`, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching completed course certificates", error);
        throw error;
    }
};
export const downloadCourseCertificate = async (payload) => {
    try {
        const res = await axios.post(`${BaseUrl}/payment/downloadCourseCertificate`, payload, {
            headers: {
                ...getHeaders(),
                "Content-Type": "application/json",
            },
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        console.error("Error downloading certificate", error);
        throw error;
    }
};

export const createCertificateIssued = async (payload) => {
    try {
        const res = await axios.post(`${BaseUrl}/payment/createCertificateIssued`, payload, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error creating issued certificate", error);
        throw error;
    }
};

export const createExtraCourseCertificate = async (payload) => {
    try {
        const res = await axios.post(`${BaseUrl}/payment/createExtraCourseCerti`, payload, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error creating extra course certificate", error);
        throw error;
    }
};
