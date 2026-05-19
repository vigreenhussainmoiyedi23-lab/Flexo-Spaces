import React from "react";

const SwapsBreifHistory = ({ user }) => {
  if (!user) {
    return null;
  }
  const succesRate =
    ((user.totalSwaps - user.totalCanceled) / user.totalSwaps) * 100 || 100;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats */}
      {[
        { label: "Total Swaps Completed", value: user.totalSwaps },
        { label: "Cancelled", value: user.totalCanceled },
        {
          label: "Success Rate",
          value: succesRate.toFixed(2) + "%",
        },
        { label: "Rating", value: user.rating },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white/5 border border-white/10 rounded-xl p-5"
        >
          <p className="text-gray-400 text-sm">{item.label}</p>
          <h3 className="text-xl mt-2">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default SwapsBreifHistory;
