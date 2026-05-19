import { useContext } from "react";
import { login, logout, register, getCurrentUser, verifyOtp, Google } from "../Services/api.service";
import { AuthContext } from "../auth.context";
import { useEffect } from "react";
import showToast from "../../../utils/Toastify.util";

const useAuth = () => {
    const { user, loading, setUser, setLoading } = useContext(AuthContext);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();
                if (response.loggedIn) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);

    const GoogleLoginHandler = async ({ credential }) => {
        setLoading(true);
        try {
            const response = await Google({ credential });
            setUser(response.user);
            showToast("Logged in successfully with Google!", "success");
            showToast("Create A Listing To Start Swapping!", "info");
            return response.user;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const loginHandler = async ({ email, password }) => {

        setLoading(true);
        try {
            const { data } = await login({ email, password });
            showToast("Verification OTP sent to your email!", "info");
            return data;
        } catch (error) {
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const logoutHandler = async () => {
        setLoading(true);
        try {
            console.log("logging out")
            const { data } = await logout();
            setUser(null);
            showToast("Logged out successfully!", "success");
            return data;
        } catch (error) {
            throw error?.response?.data;

        } finally {
            setLoading(false);
        }
    };

    const registerHandler = async ({ username, password, email }) => {
        setLoading(true);
        try {
            const { data } = await register({ username, password, email });
            showToast("Verification OTP sent to your email!", "info");

            return data;
        } catch (error) {
            throw error?.response?.data;

        } finally {
            setLoading(false);
        }
    };

    const getCurrentUserDataHandler = async () => {
        try {
            const response = await getCurrentUser();
            return response;
        } catch (error) {
            throw error;
        }
    };

    const verifyUserOtpHandler = async (otpData) => {
        setLoading(true);
        try {
            const response = await verifyOtp(otpData);
            showToast("Logged in successfully!", "success");
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        loginHandler,
        logoutHandler,
        registerHandler,
        getCurrentUserDataHandler,
        verifyUserOtpHandler,
        GoogleLoginHandler
    };
};

export default useAuth;
