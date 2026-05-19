import React, { useEffect } from "react";
import { useProfile } from "../../Hooks/useProfile";

const RecentSwaps = ({ user, isOwner }) => {
  const { GetRecentSwapsHandler, recentSwaps, loading } = useProfile();
  useEffect(() => {
    GetRecentSwapsHandler(user._id);
  }, []);
  if (recentSwaps.length == 0)
    return null
  return (
    <div className="space-y-5 bg-brand-800 rounded-lg px-3 py-2">
      <h1 className="text-center text-4xl text-accent-300 underline underline-offset-6 decoration-1 playfair">
        {isOwner ? "Your" : "User"} Recent Swaps
      </h1>
      <div className="flex text-xl montserrat items-center justify-between gap-4">
        {/* My Item */}
        <div className="flex items-center gap-3 w-5/12">
          {isOwner ? "Your" : user.username + "'s"} Listings
        </div>

        {/* Arrow */}
        <div className="text-white/50 text-lg">⇄</div>

        {/* Other Item */}
        <div className="flex text-xl montserrat items-center gap-3 w-5/12 justify-end text-right">
          Other User Listings
        </div>
      </div>
      {recentSwaps.map((swap) => {
        const isOwner = swap.owner._id === user._id;

        const myItem = isOwner ? swap.ownerListing : swap.requesterListing;
        const otherItem = isOwner ? swap.requesterListing : swap.ownerListing;

        return (
          <div
            key={swap._id}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            {/* Items Row */}
            <div className="flex items-center justify-between gap-4">
              {/* My Item */}
              <div className="flex items-center gap-3 w-5/12">
                <img
                  src={myItem.images[0].url}
                  alt={myItem.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm font-medium">{myItem.title}</p>
                  <p className="text-xs text-white/60">
                    ₹{myItem.estimatedValue}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-white/50 text-lg">⇄</div>

              {/* Other Item */}
              <div className="flex items-center gap-3 w-5/12 justify-end text-right">
                <div>
                  <p className="text-sm font-medium">{otherItem.title}</p>
                  <p className="text-xs text-white/60">
                    ₹{otherItem.estimatedValue}
                  </p>
                </div>
                <img
                  src={otherItem.images[0].url}
                  alt={otherItem.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-3 text-xs text-white/60">
              {/* Status */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                swap.status === "completed"
                  ? "bg-green-500/20 text-green-400"
                  : swap.status === "disputed"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }
            `}
              >
                {swap.status}
              </span>

              {/* Time */}
              <span>{new Date(swap.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentSwaps;
