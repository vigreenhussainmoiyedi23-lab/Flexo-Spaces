import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});

export const verifyOtp = async (otp) => {
    try {
        const response = await apiClient.post("/auth/verify-otp", {
            otp,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async ({ username, email, password }) => {
    try {
        const response = await apiClient.post("/auth/register", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const Google = async ({ credential }) => {
    try {
        const response = await apiClient.post("/auth/google", {
            credential
        });
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const login = async ({ email, password }) => {
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await apiClient.get("/auth/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get("/auth/get-me");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default { register, login, logout, getCurrentUser, verifyOtp, Google };