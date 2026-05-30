import { BookingContext } from "../booking.context.jsx";
import { useContext, useEffect } from "react";
import showToast, { showLoadingToast, updateToast } from "../../../utils/Toastify.util.jsx";
import {
    cancelSwapRequest,
    completeSwapRequest,
    rejectSwapRequest,
    acceptSwapRequest,
    createDisputeApi,
    getSwapAllDisputeApi,
    createRatingApi,
} from "../service/booking.api.js";
import { emitNotification } from "../../../utils/emitNotifications.js";

import useAuth from "../../auth/hooks/useAuth.js";
import { createBookingApi, getAvailaibilityApi, fetchBookingRequests } from "../service/booking.api.js";


const useBooking = () => {
    const { user } = useAuth();
    const {
        loading,
        userAllBookings,
        filters,
        availableSeats,
        overlappingBookings,
        setAvailableSeats,
        setOverlappingBookings,
        totalPages,
        swapAllDisputes,
        setLoading,
        setUserAllBookings,
        setFilters,
        setSwapAllDisputes,
        setTotalPages
    } = useContext(BookingContext)
    const getBookingRequests = async ({ filters }) => {
        try {
            setLoading(true);
            console.log("fetching response", filters)
            const data = await fetchBookingRequests({ filters });
            setUserAllBookings(data.bookings);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching swap requests:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const createBookingHandler = async (data) => {
        const id = showLoadingToast("Creating Booking...");
        try {
            setLoading(true);
            console.log(data)
            const response = await createBookingApi(data);
            showToast(response.message, "success");

            const update = updateToast(id, "Make Sure You Negotiate Before Shipping or Completing", "info")
        } catch (error) {
            const update = updateToast(id, error.data.message || "error creating booking", "error")
            console.error("Error creating booking:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    const getAvailableSeatsAndOverLappingBookings = async (spaceId, data) => {
        try {
            setLoading(true);
            const response = await getAvailaibilityApi(spaceId, data);

            setAvailableSeats(response.availableSeats);
            setOverlappingBookings(response.overlappingBookings);
            return response;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    const acceptSwapHandler = async (swapId) => {
        const id = showLoadingToast("accepting swap request...");
        try {
            setLoading(true);
            const response = await acceptSwapRequest(swapId);
            showToast(response.message, "success");
            const swap = response?.swap;

            if (swap) {
                emitNotification({
                    recipient: swap.requester,
                    type: "SWAP_ACCEPTED",
                    title: "Swap Accepted 🎉",
                    message: "Your swap request has been accepted " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            getBookingRequests({ filters });
            const update = updateToast(id, "Make Sure You Negotiate Before Shipping or Completing", "info")
        } catch (error) {
            console.error("Error accepting swap request:", error);
            const update = updateToast(id, error.data.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const rejectSwapHandler = async (swapId) => {
        const id = showLoadingToast("rejecting swap request...");
        try {
            setLoading(true);
            const response = await rejectSwapRequest(swapId);
            const swap = response?.swap;

            if (swap) {
                emitNotification({
                    recipient: swap.requester,
                    type: "SWAP_REJECTED",
                    title: "Swap Rejected",
                    message: "Your swap request was rejected " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            getBookingRequests({ filters });
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error.data.message, "error")
            console.error("Error rejecting swap request:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const cancelSwapHandler = async (swapId) => {
        const id = showLoadingToast("withdrawing swap request...");
        try {

            setLoading(true);
            const response = await cancelSwapRequest(swapId);
            const swap = response?.swap;

            if (swap) {
                emitNotification({
                    recipient: swap.owner,
                    type: "SWAP_CANCELLED",
                    title: "Swap Cancelled",
                    message: "The swap request has been withdrawn " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            getBookingRequests({ filters });
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error.data.message, "error")

            console.error("Error canceling swap request:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const completeSwapHandler = async (swapId) => {
        const id = showLoadingToast("completing swap request From your side...");
        try {

            setLoading(true);
            const response = await completeSwapRequest(swapId);
            await getBookingRequests({ filters });
            const swap = response?.swap;

            if (swap) {
                const otherUser =
                    user._id.toString() === swap.requester.toString()
                        ? swap.owner
                        : swap.requester;

                emitNotification({
                    recipient: otherUser,
                    type: "SWAP_COMPLETED",
                    title: "Swap Progress Updated",
                    message: "The other user marked swap as completed " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            const update = updateToast(id, response.message, "success")
            showToast("The Swap Will Be Completed As Soon As The Other User completes it", "info");
        } catch (error) {
            const update = updateToast(id, error.data.message, "error")
            console.error("Error completing swap request:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const createDisputeHandler = async (swapId, disputeDetails) => {
        const id = showLoadingToast("creating a dispute...");
        try {

            setLoading(true);
            const response = await createDisputeApi(swapId, disputeDetails);
            const swap = response?.swap;

            if (swap) {
                const otherUser =
                    user._id.toString() === swap.requester.toString()
                        ? swap.owner
                        : swap.requester;
                console.log(swap, otherUser)

                emitNotification({
                    recipient: otherUser,
                    type: "DISPUTE_CREATED",
                    title: "Dispute Raised ⚠️",
                    message: "A dispute has been raised for this swap " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
                console.log("emitted notification to", otherUser);
            }
            const update = updateToast(id, response.message, "success")

            getBookingRequests({ filters });
        } catch (error) {
            const update = updateToast(id, error?.data?.message, "error")

            throw error;
        } finally {
            setLoading(false);
        }
    };
    const getSwapAllDisputesHandler = async (swapId) => {
        const id = showLoadingToast("Loading All disputes...");
        try {
            setLoading(true);
            const response = await getSwapAllDisputeApi(swapId);
            await getBookingRequests({ filters });
            await setSwapAllDisputes(response.disputes);
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error?.data?.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const createRatingHandler = async (swapId, ratingDetails) => {
        const id = showLoadingToast("Creating Rating...");

        try {
            setLoading(true);
            const response = await createRatingApi(swapId, ratingDetails);
            await getBookingRequests({ filters });
            const swap = response?.swap;

            if (swap) {
                const otherUser =
                    user._id.toString() === swap.requester.toString()
                        ? swap.owner
                        : swap.requester;

                emitNotification({
                    recipient: otherUser,
                    type: "NEW_RATING",
                    title: "New Rating ⭐",
                    message: "You received a rating from your swap partner " + swapId.slice(-6),
                    link: `/profile/${user._id}`,
                    meta: { swapId }
                });
            }
            const update = updateToast(id, response?.message, "success")
        } catch (error) {
            const update = updateToast(id, error.data.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const fetch = async () => {
            await getBookingRequests({ filters });
        };
        fetch();
    }, []);

    return {
        createBookingHandler,
        getAvailableSeatsAndOverLappingBookings,

        getBookingRequests,
        acceptSwapHandler,
        rejectSwapHandler,
        cancelSwapHandler,
        completeSwapHandler,
        createDisputeHandler,
        getSwapAllDisputesHandler,
        createRatingHandler,
        loading,
        filters,
        userAllBookings,
        swapAllDisputes,
        totalPages,
        availableSeats,
        overlappingBookings
    };
};

export default useBooking;
