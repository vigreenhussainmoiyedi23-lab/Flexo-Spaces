import { Link } from "react-router-dom";
import React from "react";
import ListingGrid from "../../../spaces/components/ui/ListingGrid";
const UserAllListings = ({ listings, isOwner, user }) => {
  if ((!listings || listings.length === 0) && !isOwner) return null;
  return (
    <div className="w-full ">
      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-2 min-h-100">
          <h1 className="text-4xl text-accent-300 relative top-6 text-center font-bold">
            {isOwner ? "Your" : user.username + "'s"} Spaces
          </h1>
          <ListingGrid listings={listings} />
        </div>
      )}
    </div>
  );
};

export default UserAllListings;
