import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/admin" || 'http://localhost:5000/api/admin';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});

const GetAllUsers = async () => {
    try {
        const response = await apiClient.get(`/users`);
        return response.data
    } catch (error) {
        throw error;
    }
}
const GetAllListings = async () => {
    try {
        const response = await apiClient.get(`/listings`);
        return response.data
    } catch (error) {
        throw error;
    }
}
const GetAllSwaps = async () => {
    try {
        const response = await apiClient.get(`/swaps`);
        return response.data
    } catch (error) {
        throw error;
    }
}
const GetAllDisputes = async () => {
    try {

        const response = await apiClient.get(`/disputes`);

        return response?.data
    } catch (error) {
        throw error.response;
    }
}
const GetPlatformAnalytics = async () => {
    try {
        const response = await apiClient.get(`/analytics`);
        return response.data
    } catch (error) {
        throw error.response;
    }
}
const BanOrUnbanUser = async (userId) => {
    try {
        const response = await apiClient.patch(`/user/${userId}`);
        return response.data
    } catch (error) {
        throw error.response;

    }
}
const RemoveOrRestoreListing = async (listingId) => {
    try {
        const response = await apiClient.patch(`/listing/${listingId}`);
        return response.data
    } catch (error) {
        throw error.response;
    }
}
const ResolveDispute = async (diputeId, resolveData) => {
    try {
        const response = await apiClient.patch(`/dispute/${diputeId}`, resolveData);
        return response?.data
    } catch (error) {
       
        throw error.response;
    }
}
export { GetAllListings, GetAllDisputes, GetAllSwaps, GetAllUsers, GetPlatformAnalytics, BanOrUnbanUser, RemoveOrRestoreListing, ResolveDispute };