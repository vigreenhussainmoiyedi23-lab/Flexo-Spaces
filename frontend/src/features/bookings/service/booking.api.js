import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/booking" || 'http://localhost:5000/api/booking';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});
const createBookingApi = async (bookingDets) => {
    if (!bookingDets.spaceId) {
        throw new Error("   spaceId is required");
    }
    try {
        const response = await apiClient.post(`/${bookingDets.spaceId}`, bookingDets);
        return response.data;
    } catch (error) {
        console.error('Error creating swap request:', error);
        throw error.response;
    }
};
const getAvailaibilityApi = async (spaceId,data) => {
    try {
        console.log("getting response",spaceId,data)
        const response = await apiClient.post(`/${spaceId}/bookings`,data);
        return response.data;
    } catch (error) {
        console.error('Error fetching availability:', error);
        throw error.response;
    }
};


const fetchBookingRequests = async ({ filters }) => {
    try {
        console.log("getting response",filters)
        const response = await apiClient.post(`/`, { filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching swap requests:', error);
        throw error.response;
    }
}
const acceptSwapRequest = async (swapId) => {
    try {
        const response = await apiClient.patch(`/${swapId}/accept`);
        return response.data;
    } catch (error) {
        console.error('Error accepting swap request:', error);
        throw error.response;
    }
};
const rejectSwapRequest = async (swapId) => {
    try {
        const response = await apiClient.patch(`/${swapId}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting swap request:', error);
        throw error.response;
    }
};
const cancelSwapRequest = async (swapId) => {
    try {
        const response = await apiClient.patch(`/${swapId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error canceling swap request:', error);
        throw error.response;
    }
};
const completeSwapRequest = async (swapId) => {
    try {
        const response = await apiClient.patch(`/${swapId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completeing swap request:', error);
        throw error.response;
    }
};
const createDisputeApi = async (swapId, disputeDetails) => {
    try {
        const response = await apiClient.post(`/${swapId}/dispute`, disputeDetails);
        return response.data;
    } catch (error) {
        console.error('Error creating dispute for swap request:', error);
        throw error.response;
    }
}
const getSwapAllDisputeApi = async (swapId) => {
    try {
        const response = await apiClient.get(`/${swapId}/disputes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disputes for swap request:', error);
        throw error.response.data;
    }
}
const getSpaceAllBookingsApi = async (spaceId) => {
    try {
        const response = await apiClient.get(`/${swapId}/disputes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disputes for swap request:', error);
        throw error.response.data;
    }
}
const createRatingApi = async (swapId, ratingDetails) => {
    try {
        const response = await apiClient.post(`/${swapId}/rating`, ratingDetails);
        return response.data;
    } catch (error) {
        console.error('Error creating rating for other user:', error);
        throw error.response;
    }
}

export {
    createBookingApi,
    getAvailaibilityApi,
    fetchBookingRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    completeSwapRequest,
    getSpaceAllBookingsApi,
    createDisputeApi,
    createRatingApi,
    getSwapAllDisputeApi
};