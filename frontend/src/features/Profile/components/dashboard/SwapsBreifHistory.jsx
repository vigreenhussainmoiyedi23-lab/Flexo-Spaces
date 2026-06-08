import React from "react";

const SwapsBreifHistory = ({ user }) => {
  if (!user) {
    return null;
  }
  const succesRate =
    ((user.totalBookings - user.totalCanceled) / user.totalBookings) * 100 ||
    100;
  return (
    <div className="grid rounded-2xl border my-3 border-black/50 grid-cols-2 lg:grid-cols-4 gap-6 bg-white px-3 py-2">
      {/* Stats */}
      {[
        { label: "Total Bookings", value: user.totalBookings || 0 },
        { label: "Cancelled", value: user.totalCanceled || 0 },
        {
          label: "Total Completed",
          value: user.toatalCompleted || 0,
        },
        { label: "Rating", value: user.rating },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-gray-50 border border-black/50 rounded-xl p-5"
        >
          <p className="text-text-secondary text-sm">{item.label}</p>
          <h3 className="text-xl text-text-primary mt-2">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default SwapsBreifHistory;
