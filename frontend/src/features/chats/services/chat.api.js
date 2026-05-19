import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/chat" || 'http://localhost:5000/api/chat';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});

const getUserAllChats = async () => {
    try {
        const response = await apiClient.get("/");
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}
const getChatAllMessages = async ({ chatId, skip, limit }) => {
    try {
        const response = await apiClient.get(`/${chatId}?skip=${skip || 0}&limit=${limit || 20}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}
const chatAccess = async (otherUserId) => {
    try {
        const response = await apiClient.post(`/`, {
            otherUser: otherUserId,
        })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}
const UploadImage = async (files) => {
    try {
        const response = await apiClient.post(`/uploadImages`,
            files
            , { headers: { "Content-Type": "multipart/form-data" } })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export { getUserAllChats, getChatAllMessages, chatAccess, UploadImage }