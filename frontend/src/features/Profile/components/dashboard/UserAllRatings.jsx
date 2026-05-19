import React from "react";
import { useProfile } from "../../Hooks/useProfile";

const UserAllRatings = () => {
  const { userAllRatings } = useProfile();

  // ✅ Hide if no ratings
  if (!userAllRatings || userAllRatings.length === 0) return null;

  // ✅ Average rating
  const avgRating =
    userAllRatings.reduce((acc, curr) => acc + curr.ratingValue, 0) /
    userAllRatings.length;

  return (
    <div className="bg-brand-900 p-5 rounded-2xl shadow-md mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-white">
          Ratings Received
        </h2>
        <span className="text-sm text-brand-300">
          ⭐ {avgRating.toFixed(1)} / 5 ({userAllRatings.length})
        </span>
      </div>

      {/* Ratings List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {userAllRatings.map((rating) => (
          <div
            key={rating._id}
            className="bg-brand-700 p-4 rounded-xl flex gap-3"
          >
            {/* Profile Picture */}
            <img
              src={rating?.rater?.profilePicture || "/default-avatar.png"}
              alt="rater"
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex-1">
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {rating?.rater?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-brand-300">
                    {rating?.rater?.email}
                  </p>
                </div>

                {/* Stars */}
                <span className="text-yellow-400 text-sm">
                  {"⭐".repeat(rating.ratingValue)}
                </span>
              </div>

              {/* Role */}
              <p className="text-xs text-brand-300 mt-1">
                Role: {rating.role}
              </p>

              {/* Comment */}
              {rating.comment && (
                <p className="text-sm text-gray-200 mt-2">
                  {rating.comment}
                </p>
              )}

              {/* Date */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(rating.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAllRatings;