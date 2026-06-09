import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/owner-dashboard" || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});


const getStatsApi = async () => {
    try {
        const response = await apiClient.get(`/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};
const getTrendsApi = async () => {
    try {
        const response = await apiClient.get(`/trends`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        throw error;
    }
};
const getTopPerformer = async () => {
    try {
        const response = await apiClient.get(`/top-performer`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};


export { getStatsApi, getTrendsApi, getTopPerformer };