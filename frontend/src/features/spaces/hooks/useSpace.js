import { useContext } from "react";
import { SpaceContext } from "../space.context";
import service from "../service/api.service";
import showToast, { showLoadingToast, updateToast } from "../../../utils/Toastify.util";
import { useNavigate } from "react-router-dom";
import { emitNotification } from "../../../utils/emitNotifications";

export const useSpace = () => {
    // Access space context values and functions
    const {
        allSpaces,
        setAllSpaces,
        userAllSpaces,
        setUserAllSpaces,
        page,
        setPage,
        totalPages,
        setTotalPages,
        loading,
        setLoading,
        filters,
        setFilters,
        defaultFilters
    } = useContext(SpaceContext);
    const navigate = useNavigate();

    const fetchSpaces = async (filters) => {
        setLoading(true);
        try {
            const data = await service.getSpaces(filters);

            setAllSpaces(data.spaces);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching spaces:', error);
        } finally {
            setLoading(false);
        }
    };
    const createSpace = async (spaceData) => {
        setLoading(true);
        const id = showLoadingToast("Creating Space...")
        try {
            const data = await service.createSpace(spaceData);
            await fetchSpaces(filters);
            const update = updateToast(id, data.message, "success");
            navigate("/spaces")
        } catch (error) {
            const update = updateToast(id, error.data.message, "error")
        } finally {
            setLoading(false);
        }
    };
    const updateSpace = async (spaceId, spaceData) => {
        setLoading(true);
        const id = showLoadingToast("Updating space...")

        try {
            const data = await service.updateSpace(spaceId, spaceData);
            await fetchSpaces(filters);
            const update = updateToast(id, data.message, "success");
        } catch (error) {
            console.error('Error updating space:', error);
            const update = updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false);
        }
    };
    const getSpaceById = async (spaceId) => {
        setLoading(true);
        try {
            const data = await service.getSpaceById(spaceId);
            return data;
        } catch (error) {
            console.error('Error fetching space by ID:', error);
        } finally {
            setLoading(false);
        }
    };
    const deleteSpace = async (spaceId) => {
        setLoading(true);
        const id = showLoadingToast("Deleting space...")
        try {
            const data = await service.deleteSpace(spaceId);
            await fetchSpaces(filters);
            const update = updateToast(id, data.message, "success");

        } catch (error) {
            console.error('Error deleting space:', error);
            const update = updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false);
        }
    };
    const createBooking = async (spaceId) => {
        setLoading(true);
        const id = showLoadingToast("Creating Booking...")
        try {
            const data = await createBookingRequest({ spaceId: spaceId });
            showToast("Booking created successfully!", "success");
            const booking = data?.booking;

            if (booking?.owner) {
                emitNotification({
                    recipient: booking.owner,
                    type: "SWAP_REQUEST",
                    title: "Swap Request 🎉",
                    message: "You have a new swap request",
                    link: `/swaps`,
                    meta: { bookingId: booking._id }
                });
            }
            const update = updateToast(id, data.message, "success")
        } catch (error) {
            const update = updateToast(id, error.data.message || error?.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const updateFilters = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }
    const updatePricing = (updates) => {
        setFilters(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                ...updates,
            },
        }));
    };
    const clearFilters = () => {
        setFilters(defaultFilters);
    };
    return {
        // Handlers
        fetchSpaces,
        createSpace,
        updateSpace,
        getSpaceById,
        deleteSpace,
        createBooking,
        updateFilters,
        updatePricing,
        clearFilters,
        //States
        allSpaces,
        loading,
        totalPages,
        filters,
    };
};


