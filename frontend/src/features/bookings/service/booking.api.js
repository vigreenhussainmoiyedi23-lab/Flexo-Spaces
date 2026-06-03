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
const getAvailaibilityApi = async (spaceId, data) => {
    try {
        const response = await apiClient.post(`/${spaceId}/bookings`, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching availability:', error);
        throw error.response;
    }
};


const fetchBookingRequests = async ({ filters }) => {
    try {
        const response = await apiClient.post(`/`, { filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching swap requests:', error);
        throw error.response;
    }
}
const acceptBookingRequest = async (bookingId) => {
    try {
        const response = await apiClient.patch(`/${bookingId}/accept`);
        return response.data;
    } catch (error) {
        console.error('Error accepting booking request:', error);
        throw error.response;
    }
};
const rejectBookingRequest = async (bookingId) => {
    try {
        const response = await apiClient.patch(`/${bookingId}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting booking request:', error);
        throw error.response;
    }
};
const withdrawBookingRequest = async (bookingId) => {
    try {
        const response = await apiClient.patch(`/${bookingId}/withdraw`);
        return response.data;
    } catch (error) {
        console.error('Error withdrawing booking request:', error);
        throw error.response;
    }
};
const cancelBookingRequest = async (bookingId) => {
    try {
        const response = await apiClient.patch(`/${bookingId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error canceling Booking request:', error);
        throw error.response;
    }
};
const completeBookingRequest = async (bookingId) => {
    try {
        const response = await apiClient.patch(`/${bookingId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completeing Booking request:', error);
        throw error.response;
    }
};
const createDisputeApi = async (bookingId, disputeDetails) => {
    try {
        const response = await apiClient.post(`/${bookingId}/dispute`, disputeDetails);
        return response.data;
    } catch (error) {
        console.error('Error creating dispute for Booking request:', error);
        throw error.response;
    }
}

const getBookingAllDisputeApi = async (bookingId) => {
    try {
        const response = await apiClient.get(`/${bookingId}/disputes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disputes for Booking request:', error);
        throw error.response.data;
    }
}

const getSpaceAllBookingsApi = async (spaceId) => {
    try {
        const response = await apiClient.get(`/${spaceId}/disputes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disputes for Booking request:', error);
        throw error.response.data;
    }
}
async function getBookingAlternativeAndConsequences(bookingId) {
    try {
        const [alternatives, consequences] = await Promise.all([apiClient.get(`/${bookingId}/alternative`), apiClient.get(`/${bookingId}/consequences`)])
        return [alternatives.data?.result, consequences.data?.consequences];
    } catch (error) {
        console.error('Error fetching alternatives for Booking request:', error);
        throw error.response.data;
    }
}

export {
    createBookingApi,
    getAvailaibilityApi,
    fetchBookingRequests,
    acceptBookingRequest,
    rejectBookingRequest,
    cancelBookingRequest,
    completeBookingRequest,
    getSpaceAllBookingsApi,
    createDisputeApi,
    getBookingAllDisputeApi,
    getBookingAlternativeAndConsequences,
    withdrawBookingRequest
};