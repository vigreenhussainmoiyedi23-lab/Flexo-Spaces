// notification.api.js

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}`
    : "http://localhost:3000/api";

const API_URL = `${API_BASE}/user`;

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// get notifications
export const getNotifications = async ({ page = 1, limit = 20 }) => {
    try {
        const res = await apiClient.get(`/notifications?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response;
    }
};

// mark all as read
export const markAllAsRead = async () => {
    try {
        throw new Error("markAllAsRead REST endpoint not available");
    } catch (error) {
        throw error;
    }
};