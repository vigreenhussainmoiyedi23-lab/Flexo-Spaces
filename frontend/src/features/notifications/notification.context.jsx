// notifications.context.jsx

import { createContext, useState } from "react";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications,
                unreadCount,
                setUnreadCount,
                loading,
                setLoading,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;