import { useContext } from "react";
import { AdminContext } from "../admin.context";
import { GetAllListings, GetAllSwaps, GetAllUsers, GetPlatformAnalytics, BanOrUnbanUser, RemoveOrRestoreListing, ResolveDispute, GetAllDisputes } from "../service/admin.api";
import { emitNotification } from "../../../utils/emitNotifications";
import { showLoadingToast, updateToast } from "../../../utils/Toastify.util";

export default function useAdmin() {
    const {
        users,
        setUsers,
        listings,
        setListings,
        swaps,
        setSwaps,
        disputes,
        setDisputes,
        loading,
        setLoading,
        analyticsTotal,
        setAnalyticsTotal,
        analyticsDaily,
        setAnalyticsDaily,
        insights,
        setInsights,
    } = useContext(AdminContext);
    const GetAllUsersHandler = async () => {
        setLoading(true);
        try {
            const response = await GetAllUsers();
            setUsers(response.users);
        } catch (error) {
            throw new Error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    const GetAllListingsHandler = async () => {
        setLoading(true);
        try {
            const response = await GetAllListings();
            setListings(response.listings);
        } catch (error) {
            throw new Error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    const GetAllSwapsHandler = async () => {
        setLoading(true);
        try {
            const response = await GetAllSwaps();
            setSwaps(response.swaps);
        } catch (error) {
            throw new Error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    const GetAllDisputesHandler = async () => {
        setLoading(true);
        try {
            const response = await GetAllDisputes();
            setDisputes(response.disputes);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    const GetPlatformAnalyticsHandler = async () => {
        setLoading(true);
        try {
            const { data } = await GetPlatformAnalytics();
            console.log("platform analytics", data);
            setAnalyticsTotal(data.totals);
            setAnalyticsDaily(data.daily);
            setInsights(data.insights?.value);
        } catch (error) {
            throw new Error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    const BanOrUnbanUserHandler = async (userId) => {
        const id = showLoadingToast("Banning/Unbanning User...")
        setLoading(true);
        try {
            const response = await BanOrUnbanUser(userId);
            GetAllUsersHandler()
            emitNotification({
                recipient: userId,
                type: "ADMIN_ALERT",
                title: "Account Status Updated",
                message: response?.message || "Your account status was updated by admin",
                link: "/profile",
            });
            const update = updateToast(id, response.message, "success")
            return response;
        } catch (error) {
            updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false);
        }
    };
    const RemoveOrRestoreListingHandler = async (listingId) => {
        const id = showLoadingToast("removing/restoring listing...")
        setLoading(true);
        try {
            const response = await RemoveOrRestoreListing(listingId);
            GetAllListingsHandler()
            // 🔔 Notification (if owner exists)
            const ownerId = response?.listing?.owner;

            if (ownerId) {
                emitNotification({
                    recipient: ownerId,
                    type: "ADMIN_ALERT",
                    title: "Listing Updated",
                    message: response?.message || "Your listing status was updated by admin",
                    link: `/listing/${listingId}`,
                });
            }
            updateToast(id, response.message, "success")
            return response;
        } catch (error) {
            console.error(error)
            updateToast(id, error.data.message || "failed", "error")

        } finally {
            setLoading(false);
        }
    };
    const ResolveDisputeHandler = async (disputeId, resolveData) => {
        const id = showLoadingToast("resolving/rejecting dispute...")
        setLoading(true);
        try {
            const response = await ResolveDispute(disputeId, resolveData);
            await GetAllDisputesHandler()
            // 🔔 Notifications to both parties
            const dispute = response?.dispute;
            if (dispute) {
                const users = [dispute.raisedBy, dispute.against];

                users.forEach((userId) => {
                    console.log("emitting notification", userId);
                    if (userId) {
                        emitNotification({
                            recipient: userId,
                            type: "DISPUTE_RESOLVED", // you can rename later to RESOLVED
                            title: "Dispute Resolved",
                            message: "Your dispute has been reviewed by admin",
                            link: `/swaps`,
                            meta: { disputeId }
                        });
                    }
                });
            }
            updateToast(id, response.message, "success")

            return response;
        } catch (error) {
    
            updateToast(id, error.data.message || "failed", "error")

        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        listings,
        swaps,
        disputes,
        loading,
        analyticsTotal,
        analyticsDaily,
        insights,
        GetAllUsersHandler,
        GetAllListingsHandler,
        GetAllSwapsHandler,
        GetPlatformAnalyticsHandler,
        BanOrUnbanUserHandler,
        RemoveOrRestoreListingHandler,
        ResolveDisputeHandler,
        GetAllDisputesHandler
    }
}