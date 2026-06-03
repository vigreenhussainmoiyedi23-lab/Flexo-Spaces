import { BookingContext } from "../booking.context.jsx";
import { useContext, useEffect } from "react";
import showToast, { showLoadingToast, updateToast } from "../../../utils/Toastify.util.jsx";
import {
    cancelBookingRequest,
    completeBookingRequest,
    acceptBookingRequest,
    rejectBookingRequest,
    withdrawBookingRequest,

} from "../service/booking.api.js";
import { emitNotification } from "../../../utils/emitNotifications.js";

import useAuth from "../../auth/hooks/useAuth.js";
import { createBookingApi, getAvailaibilityApi, fetchBookingRequests } from "../service/booking.api.js";


const useBooking = () => {
    const { user } = useAuth();

    // Booking Context
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

    // booking handler
    const getBookingRequests = async ({ filters }) => {
        try {
            setLoading(true);
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
    const createBookingHandler = async (data) => {
        const id = showLoadingToast("Creating Booking...");
        try {
            setLoading(true);
            const response = await createBookingApi(data);
            showToast(response.message, "success");
          

            emitNotification({
                recipient: response.booking.owner,
                type: "BOOKING_REQUEST",
                title: "New Booking Request 🎉",
                message: "You Have received a new booking request.",
                link: `/bookings/${response.booking.id}`,
            });
            getBookingRequests({ filters });
            const update = updateToast(id, "Make Sure You Negotiate Before Shipping or Completing", "info")
        } catch (error) {
            const update = updateToast(id, error.data.message || "error creating booking", "error")
            console.error("Error creating booking:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const acceptBookingHandler = async (bookingId) => {
        const id = showLoadingToast("accepting swap request...");
        try {
            setLoading(true);
            const response = await acceptBookingRequest(bookingId);
            showToast(response.message, "success");
            const booking = response?.booking;

            emitNotification({
                recipient: booking.bookedBy,
                type: "BOOKING_ACCEPTED",
                title: "Booking Accepted 🎉",
                message: "Your booking request has been accepted " + bookingId.slice(-6),
                link: `/bookings`,
            });

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

    const rejectBookingHandler = async (bookingId) => {
        const id = showLoadingToast("rejecting swap request...");
        try {
            setLoading(true);
            const response = await rejectBookingRequest(bookingId);
            const booking = response?.booking;
         

            if (booking) {
                emitNotification({
                    recipient: booking.bookedBy,
                    type: "BOOKING_REJECTED",
                    title: "Booking Rejected",
                    message: "Your booking request was rejected " + bookingId.slice(-6),
                    link: `/bookings`,
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
    const withdrawBookingHandler = async (bookingId) => {
        const id = showLoadingToast("withdrawing swap request...");
        try {
            setLoading(true);
            const response = await withdrawBookingRequest(bookingId);
            const booking = response?.booking;
          
            if (booking) {
                emitNotification({
                    recipient: booking.owner,
                    type: "BOOKING_WITHDRAWN",
                    title: "Booking withdrawn",
                    message: "Your booking request was withdrawn " + bookingId.slice(-6),
                    link: `/bookings`,
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
    const completeBookingHandler = async (bookingId) => {
        const id = showLoadingToast("confirming booking request...");
        try {
            setLoading(true);
            const response = await completeBookingRequest(bookingId);
            const booking = response?.booking;

            if (booking) {
                emitNotification({
                    recipient: booking.bookedBy,
                    type: "BOOKING_COMPLETED",
                    title: "Booking Completed",
                    message: "Your booking request has been completed " + bookingId.slice(-6),
                    link: `/bookings`,
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
        acceptBookingHandler,
        rejectBookingHandler,
        completeBookingHandler,
        withdrawBookingHandler,

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
