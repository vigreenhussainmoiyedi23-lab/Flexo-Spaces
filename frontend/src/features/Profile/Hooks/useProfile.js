import { useContext } from "react";
import { getRecentSwaps, getUserAllListings, getUserData, updateProfile } from "../services/profile.api"
import { ProfileContext } from "../profile.context";
import { useEffect } from "react";
import { showLoadingToast, updateToast } from "../../../utils/Toastify.util";


export const useProfile = () => {
    const {
        userAllListings,
        setUserAllListings,
        profileUser,
        setProfileUser,
        loading,
        setLoading,
        recentSwaps,
        setRecentSwaps, userAllRatings,
        setUserAllRatings,
    } = useContext(ProfileContext)
    const fetchUserAllListings = async (userId) => {
        setLoading(true)
        try {
            const response = await getUserAllListings(userId);
            setUserAllListings(response?.listings)
            return response
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const fetchUserAllRatings = async (userId) => {
        setLoading(true)
        try {
            const response = await getUserAllListings(userId);
            setUserAllRatings(response?.ratings)
            return response
        } catch (error) {
            console.error('Error fetching user ratings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const fetchUserData = async (userId) => {
        setLoading(true)
        try {
            const response = await getUserData(userId);
            setProfileUser(response?.userData)
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
        } finally {
            setLoading(false)
        }
    };
    const GetRecentSwapsHandler = async (userId) => {
        try {
            setLoading(true)
            const response = await getRecentSwaps(userId)
            setRecentSwaps(response?.recentswaps)
        } catch (error) {
            console.error('Error fetching user listings:', error);

        } finally {
            setLoading(false)
        }
    }
    const updateProfileHandler = async (data) => {
        const id = showLoadingToast("Updating Profile...")
        try {
            setLoading(true)
            const response = await updateProfile(data)
            updateToast(id, response.message, "success")
        } catch (error) {
            console.error('Error fetching user listings:', error);
            updateToast(id, error.data.message, "error")

        } finally {
            setLoading(false)
        }
    }

    return {
        fetchUserAllListings,
        updateProfileHandler,
        fetchUserData,
        GetRecentSwapsHandler,
        fetchUserAllRatings,
        recentSwaps,
        userAllListings,
        profileUser,
        loading,
        userAllRatings
    };
}


