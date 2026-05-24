import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/spaces" || 'http://localhost:5000/api/listings';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});
async function getSpaceById(spaceId) {
    try {
        const response = await apiClient.get(`/${spaceId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching space by ID:', error);
        throw error;
    }
}
const getSpaces = async (filters) => {
    try {
        const response = await apiClient.post('/get-all', filters);
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};
const createSpace = async (listingData) => {
    try {
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

const updateSpace = async (spaceId, spaceData) => {
    try {
        const response = await apiClient.patch(`/${spaceId}`, spaceData);
        return response.data;
    } catch (error) {
        console.error('Error updating space:', error);
        throw error;
    }
};
const deleteSpace = async (spaceId) => {
    try {
        const response = await apiClient.delete(`/${spaceId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting space:', error);
        throw error;
    }
};

export default {
    getSpaceById,
    getSpaces,
    createSpace,
    updateSpace,
    deleteSpace
};
