// useNotification.js

import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../notification.context";
import { getNotifications } from "../service/notification.api";
import { socketManager } from "../../../utils/socket";

const useNotification = () => {
  const {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    loading,
    setLoading,
  } = useContext(NotificationContext);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const totalRef = useRef(null);
  const isFetchingMoreRef = useRef(false);

  // ✅ fetch notifications
  const fetchNotifications = async ({ page: nextPage = 1, limit = 20, append = false }) => {
    try {
      setLoading(true);
      const data = await getNotifications({ page: nextPage, limit });

      // backend returns: { notifications: { notifications: [], unreadCount, total }, success, message }
      const list = data?.notifications?.notifications || [];
      const total = data?.notifications?.total;
      if (typeof total === "number") totalRef.current = total;

      setNotifications((prev) => (append ? [...prev, ...list] : list));

      if (typeof data?.notifications?.unreadCount === "number") {
        setUnreadCount(data.notifications.unreadCount);
      } else {
        const unread = (append ? [...notifications, ...list] : list).filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }

      const knownTotal = typeof totalRef.current === "number" ? totalRef.current : null;
      const loadedCount = append ? notifications.length + list.length : list.length;
      if (knownTotal !== null) {
        setHasMore(loadedCount < knownTotal);
      } else {
        setHasMore(list.length === limit);
      }

      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async ({ limit = 20 } = {}) => {
    if (loading || !hasMore || isFetchingMoreRef.current) return;
    isFetchingMoreRef.current = true;
    try {
      await fetchNotifications({ page: page + 1, limit, append: true });
    } finally {
      isFetchingMoreRef.current = false;
    }
  };

  // ✅ mark all as read
  const markAllAsReadHandler = async () => {
    try {
      socketManager.emitMessage("mark_all_as_read");
    } catch (error) {
      console.error("Error marking notifications read", error);
    }
  };

  // ✅ realtime listener
  useEffect(() => {
    socketManager.listenMessage("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      if (typeof totalRef.current === "number") totalRef.current += 1;
    });

    socketManager.listenMessage("all_notifications_read", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    return () => {
      socketManager.removeListener("new_notification");
      socketManager.removeListener("all_notifications_read");
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsReadHandler,
    hasMore,
    loadMore,
  };
};

export default useNotification;