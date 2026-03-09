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

export const getAllResources = async ({ page = 1, limit = 10, search = "" } = {}) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
        });
        const res = await axios.get(`${BaseUrl}/resource/getResources?${params.toString()}`, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching resources", error);
        throw error;
    }
};

export const createResource = async (payload) => {
    try {
        const res = await axios.post(`${BaseUrl}/resource/createNewResource`, payload, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error creating resource", error);
        throw error;
    }
};

export const updateResource = async (id, payload) => {
    try {
        const res = await axios.put(`${BaseUrl}/resource/updateResource?id=${id}`, payload, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error updating resource", error);
        throw error;
    }
};

export const deleteResource = async (id) => {
    try {
        const res = await axios.delete(`${BaseUrl}/resource/deleteResource?id=${id}`, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting resource", error);
        throw error;
    }
};

export const uploadResourceFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file); // Assuming the backend still expects 'image' or change to 'file' if needed. We'll use the existing upload-image endpoint for now.

        // Use the existing generic upload endpoint from user module or course module if possible.
        // If there's a specific one, it should be updated here. We'll stick to user/upload-image like in course.js
        const res = await axios.post(`${BaseUrl}/user/upload-image`, formData, {
            headers: {
                ...getHeaders(),
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error uploading file", error);
        throw error;
    }
};
