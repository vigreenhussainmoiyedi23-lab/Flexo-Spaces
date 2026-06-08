import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/user" || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});


const getUserAllSpaces = async (userId) => {
    try {
        const response = await apiClient.get(`/spaces/${userId}`);
        console.log("User spaces response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user spaces:', error);
        throw error;
    }
};
const getUserAllRatings = async (userId) => {
    try {
        const response = await apiClient.get(`/ratings/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        throw error;
    }
};
const getUserData = async (userId) => {
    try {
        const response = await apiClient.get(`/data/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
const getRecentSwaps = async (userId) => {
    try {
        const response = await apiClient.get(`/recentSwaps/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
const updateProfile = async (data) => {
    try {
        const response = await apiClient.put(`/profile`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export { getUserAllSpaces, getUserAllRatings, getUserData, getRecentSwaps, updateProfile };