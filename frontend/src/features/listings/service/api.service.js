import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/listings" || 'http://localhost:5000/api/listings';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});
async function getListingById(listingId) {
    try {
        const response = await apiClient.get(`/${listingId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching listing by ID:', error);
        throw error;
    }
}
const getListings = async (filters) => {
    try {
        const response = await apiClient.post('/get-all', filters);
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};
const createListing = async (listingData) => {
    try {
        console.log("posting /api/listings")
        const response = await apiClient.post('/', listingData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error.response;
    }
};

const updateListing = async (listingId, listingData) => {
    try {
        const response = await apiClient.patch(`/${listingId}`, listingData);
        return response.data;
    } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
    }
};
const deleteListing = async (listingId) => {
    try {
        const response = await apiClient.delete(`/${listingId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
};

export default {
    getListingById,
    getListings,
    createListing,
    updateListing,
    deleteListing
};
