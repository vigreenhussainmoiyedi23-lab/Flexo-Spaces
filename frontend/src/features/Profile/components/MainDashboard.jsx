import React from "react";
import ProfileHeader from "./dashboard/ProfileHeader";
import SwapsBreifHistory from "./dashboard/SwapsBreifHistory";
import RecentSwaps from "./dashboard/RecentSwaps";
import UserAllListings from "./dashboard/UserAllListings";
import UserAllRatings from "./dashboard/UserAllRatings";

const MainDashboard = ({ user, listings, isOwner }) => {

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader user={user} isOwner={isOwner} />
      <SwapsBreifHistory user={user} />
      <UserAllRatings />
      <UserAllListings user={user} listings={listings} isOwner={isOwner} />
      <RecentSwaps user={user} isOwner={isOwner} />
    </div>
  );
};

export default MainDashboard;
