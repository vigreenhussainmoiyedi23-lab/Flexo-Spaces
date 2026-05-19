import React, { useEffect } from "react";
import useNotification from "../hook/useNotification";

const Notification = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsReadHandler,
    hasMore,
    loadMore,
  } = useNotification();

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20, append: false });
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-brand-100">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-[12vh] min-h-screen bg-brand-900 text-brand-100">
      
      {/* Header */}
      <div className="p-4 border-b border-brand-800 flex justify-between items-center">
        <h2 className="text-xl playfair">Notifications</h2>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="text-sm text-yellow-400">
              {unreadCount} unread
            </span>
          )}

          <button
            onClick={markAllAsReadHandler}
            className="text-sm bg-brand-700 px-3 py-1 rounded hover:bg-brand-500"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3"
        onScroll={(e) => {
          const el = e.currentTarget;
          const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
          if (nearBottom && hasMore && !loading) {
            loadMore({ limit: 20 });
          }
        }}
      >
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded cursor-pointer transition-all border 
                ${
                  n.isRead
                    ? "bg-brand-800 border-brand-800"
                    : "bg-brand-700 border-brand-500"
                }`}
              onClick={() => {
                if (n.link) window.location.href = n.link;
              }}
            >
              {/* Title */}
              <p className="font-semibold">{n.title}</p>

              {/* Message */}
              {n.message && (
                <p className="text-sm text-gray-300 mt-1">
                  {n.message}
                </p>
              )}

              {/* Time */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

        {loading && notifications.length > 0 && (
          <p className="text-gray-400 text-center py-4 text-sm">Loading more...</p>
        )}

        {!hasMore && notifications.length > 0 && (
          <p className="text-gray-500 text-center py-4 text-sm">You've reached the end</p>
        )}
      </div>
    </div>
  );
};

export default Notification;