import { SwapContext } from "../swap.context";
import { useContext, useEffect } from "react";
import showToast, { showLoadingToast, updateToast } from "../../../utils/Toastify.util.jsx";
import {
    fetchSwapRequests,
    cancelSwapRequest,
    completeSwapRequest,
    rejectSwapRequest,
    acceptSwapRequest,
    shipmentUpdateSwapRequest,
    changeShipmentTypeSwapRequest,
    shipmentAddressApi,
    createDisputeApi,
    getSwapAllDisputeApi,
    createRatingApi
} from "../service/swap.api";
import { emitNotification } from "../../../utils/emitNotifications.js";

import useAuth from "../../auth/hooks/useAuth";


const useSwap = () => {
    const { user } = useAuth();
    const {
        loading,
        userAllSwaps,
        filters,
        totalPages,
        swapAllDisputes,
        setLoading,
        setUserAllSwaps,
        setFilters,
        setSwapAllDisputes,
        setTotalPages
    } = useContext(SwapContext)
    const getSwapRequests = async ({ filters }) => {
        try {
            setLoading(true);
            const data = await fetchSwapRequests({ filters });
            setUserAllSwaps(data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching swap requests:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
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
            getSwapRequests({ filters });
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
            getSwapRequests({ filters });
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
            getSwapRequests({ filters });
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
            await getSwapRequests({ filters });
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
    const shipmentDetailsHandler = async (swapId, shipmentDetails) => {
        const id = showLoadingToast("adding sipment details...");
        try {

            setLoading(true);
            const response = await shipmentUpdateSwapRequest(swapId, shipmentDetails);
            await getSwapRequests({ filters });
            const swap = response?.swap;

            if (swap) {
                const otherUser =
                    user._id.toString() === swap.requester.toString()
                        ? swap.owner
                        : swap.requester;

                emitNotification({
                    recipient: otherUser,
                    type: "SWAP_SHIPPED",
                    title: "Item Shipped 📦",
                    message: "Shipment details have been added " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            showToast("Before Completing Make Sure You receive the item", "info");
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error.message, "error")
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

            getSwapRequests({ filters });
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
            await getSwapRequests({ filters });
            await setSwapAllDisputes(response.disputes);
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error?.data?.message, "error")
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const shipmentAddressHandler = async (swapId, shipmentAddress) => {
        const id = showLoadingToast("adding shipping address...");
        try {
            setLoading(true);
            const response = await shipmentAddressApi(swapId, shipmentAddress);
            await getSwapRequests({ filters });
            const swap = response?.swap;

            if (swap) {
                const otherUser =
                    user._id.toString() === swap.requester.toString()
                        ? swap.owner
                        : swap.requester;

                emitNotification({
                    recipient: otherUser,
                    type: "SWAP_ADDRESS_ADDED",
                    title: "Address Added",
                    message: "Shipping address has been provided " + swapId.slice(-6),
                    link: `/swaps`,
                    meta: { swapId }
                });
            }
            const update = updateToast(id, response.message, "success")
            showToast("Add Tracking Number And Courier Id After Shipping", "info");
        } catch (error) {
            const update = updateToast(id, error.message, "error")

            throw error;
        } finally {
            setLoading(false);
        }
    };
    const changeShipmentTypeHandler = async (swapId, changeTo) => {
        const id = showLoadingToast("updating shipment type...");
        try {

            setLoading(true);
            const response = await changeShipmentTypeSwapRequest(swapId, changeTo);
            await getSwapRequests({ filters });
            if (changeTo === "local_swap") {
                showToast("Before Completing Make Sure You receive the item", "info");
            }
            const update = updateToast(id, response.message, "success")
        } catch (error) {
            const update = updateToast(id, error.message, "success")
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
            await getSwapRequests({ filters });
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
            await getSwapRequests({ filters });
        };
        fetch();
    }, []);

    return {
        getSwapRequests,
        acceptSwapHandler,
        rejectSwapHandler,
        cancelSwapHandler,
        completeSwapHandler,
        shipmentDetailsHandler,
        changeShipmentTypeHandler,
        shipmentAddressHandler,
        createDisputeHandler,
        getSwapAllDisputesHandler,
        createRatingHandler,
        loading,
        filters,
        userAllSwaps,
        swapAllDisputes,
        totalPages
    };
};

export default useSwap;
