import { useContext } from "react";
import { showLoadingToast, updateToast } from "../../../utils/Toastify.util";
import { OwnerDashboardContext } from "../ownerDashboard.context";
import { getStatsApi, getTopPerformer, getTrendsApi } from "../services/ownerDashboard.api";
import { useEffect } from "react";


export const useOwnerDashboard = () => {
    const {
        loading,
        stats,
        topPerformer,
        trends,
        setLoading,
        setStats,
        setTopPerformer,
        setTrends,
    } = useContext(OwnerDashboardContext)
    const fetchOwnerStats = async (userId) => {
        setLoading(true)
        try {
            const response = await getStatsApi(userId);
            console.log(response, "response from user stats")
            setStats(response)
            return response
        } catch (error) {
            console.error('Error fetching user spaces:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const fetchOwnerTopPerformer = async (userId) => {
        setLoading(true)
        try {
            const response = await getTopPerformer(userId);
            setTopPerformer(response)
            return response
        } catch (error) {
            console.error('Error fetching user ratings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const fetchOwnerTrends = async (userId) => {
        setLoading(true)
        try {
            const response = await getTrendsApi(userId);
            setTrends(response)
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchOwnerStats();
        fetchOwnerTopPerformer();
        fetchOwnerTrends();
    }, [])

    return {
        fetchOwnerStats,
        fetchOwnerTrends,
        fetchOwnerTopPerformer,
        loading,
        stats,
        topPerformer,
        trends,
    };
}


