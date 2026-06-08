import { Link } from "react-router-dom";
import React from "react";
import ListingGrid from "../../../spaces/components/ui/ListingGrid";
const UserAllListings = ({ listings, isOwner, user }) => {
  if ((!listings || listings.length === 0) && !isOwner) return null;
  console.log(listings);
  return (
    <div className="w-full bg-white border border-black/50 rounded-2xl my-2 py-5 px-2">
      <h1 className="shanti text-3xl -mb-[10vh] px-3 py-2">User All Spaces</h1>

      <ListingGrid spaces={listings} />
    </div>
  );
};

export default UserAllListings;
