import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/swaps" || 'http://localhost:5000/api/swaps';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});
const createSwapRequest = async ({ offeredListingId, requestedListingId, message }) => {
    if (!offeredListingId || !requestedListingId) {
        throw new Error("Both offeredListingId and requestedListingId are required");
    }
    try {
        const response = await apiClient.post(`/${requestedListingId}`, { requesterListingId: offeredListingId, message: message || "" });
        return response.data;
    } catch (error) {
        console.error('Error creating swap request:', error);
        throw error.response;
    }
};
const fetchSwapRequests = async ({ filters }) => {
    try {
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
const shipmentUpdateSwapRequest = async (swapId, shipmentDetails) => {
    try {
        console.log(shipmentDetails)
        const response = await apiClient.patch(`/${swapId}/shipment`, { ...shipmentDetails });
        return response.data;
    } catch (error) {
        console.error('Error updating shipment details for swap request:', error);
        throw error.response.data;
    }
};
const shipmentAddressApi = async (swapId, shipmentAddress) => {
    try {
        const response = await apiClient.patch(`/${swapId}/shippingAddress`, { ...shipmentAddress });
        return response.data;
    } catch (error) {
        console.error('Error updating shipment details for swap request:', error);
        throw error.response.data;
    }
};
const changeShipmentTypeSwapRequest = async (swapId, changeTo) => {
    try {
        const response = await apiClient.patch(`/${swapId}/shipmentType`, { changeTo });
        return response.data;
    } catch (error) {
        console.error('Error changing shipment type for swap request:', error);
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
    createSwapRequest,
    fetchSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    completeSwapRequest,
    shipmentUpdateSwapRequest,
    changeShipmentTypeSwapRequest,
    shipmentAddressApi,
    createDisputeApi,
    createRatingApi,
    getSwapAllDisputeApi
};