import { useContext } from "react";
import { ListingContext } from "../listing.context";
import service from "../service/api.service";
import showToast, { showLoadingToast, updateToast } from "../../../utils/Toastify.util";
import { createSwapRequest } from "../../swap/service/swap.api";
import { useNavigate } from "react-router-dom";
import { emitNotification } from "../../../utils/emitNotifications";

export const useListing = () => {
    // Access listing context values and functions
    const {
        allListings,
        setAllListings,
        userAllListings,
        setUserAllListings,
        page,
        setPage,
        totalPages,
        setTotalPages,
        loading,
        setLoading,
        filters,
        setFilters,
    } = useContext(ListingContext);
    const navigate = useNavigate();

    const fetchListings = async (filters) => {
        setLoading(true);
        try {
            const data = await service.getListings(filters);

            setAllListings(data.listings);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };
    const createListing = async (listingData) => {
        setLoading(true);
        const id = showLoadingToast("Creating listing...")
        try {
            const data = await service.createListing(listingData);
            await fetchListings(filters);
            const update = updateToast(id, data.message, "success");
            navigate("/listings")
        } catch (error) {
            console.error('Error creating listing:', error);
            const update = updateToast(id, error.data.message, "error")
        } finally {
            setLoading(false);
        }
    };
    const updateListing = async (listingId, listingData) => {
        setLoading(true);
        const id = showLoadingToast("Updating listing...")

        try {
            const data = await service.updateListing(listingId, listingData);
            await fetchListings(filters);
            const update = updateToast(id, data.message, "success");
        } catch (error) {
            console.error('Error updating listing:', error);
            const update = updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false);
        }
    };
    const getListingById = async (listingId) => {
        setLoading(true);
        try {
            const data = await service.getListingById(listingId);
            return data;
        } catch (error) {
            console.error('Error fetching listing by ID:', error);
        } finally {
            setLoading(false);
        }
    };
    const deleteListing = async (listingId) => {
        setLoading(true);
        const id = showLoadingToast("Deleting listing...")
        try {
            const data = await service.deleteListing(listingId);
            await fetchListings(filters);
            const update = updateToast(id, data.message, "success");

        } catch (error) {
            console.error('Error deleting listing:', error);
            const update = updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false);
        }
    };
    const createSwap = async ({ offeredListingId, requestedListingId }) => {
        setLoading(true);
        const id = showLoadingToast("Creating Swap...")
        try {
            const data = await createSwapRequest({ offeredListingId: offeredListingId, requestedListingId: requestedListingId });
            showToast("Swap created successfully!", "success");
            const swap = data?.swap;

            if (swap) {
                emitNotification({
                    recipient: swap.owner,
                    type: "SWAP_REQUEST",
                    title: "Swap Request 🎉",
                    message: "You have a new swap request",
                    link: `/swaps`,
                    meta: { swapId: swap._id }
                });
                console.log("emitted a notification to", swap.owner);
            }
            const update = updateToast(id, data.message, "success")
        } catch (error) {
            const update = updateToast(id, error.data.message || error?.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Handlers
        fetchListings,
        createListing,
        updateListing,
        getListingById,
        deleteListing,
        createSwap,

        //States
        allListings,
        loading,
        totalPages
    };
};


