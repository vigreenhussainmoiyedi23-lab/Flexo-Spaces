import { Link } from "react-router-dom";
import React from "react";
import ListingGrid from "../../../listings/components/ui/ListingGrid";
const UserAllListings = ({ listings, isOwner, user }) => {
  if ((!listings || listings.length === 0) && !isOwner) return null;
  return (
    <div className="w-full ">
      {(!listings || listings.length === 0) && (
        <div className="text-center w-full text-brand-400  flex items-center flex-col justify-center gap-4 border-accent-300 border-t pt-4 rounded-xl">
          <h1 className="text-accent-500 text-3xl text-center md:text-5xl playfair">
            You Dont Have Any Listing's
          </h1>
          <Link
            to="/createListing"
            className="bg-accent-300 text-xl font-bold source-code-pro text-brand-900 rounded-xl px-4 py-2 border-accent-500 border-1 mt-5"
          >
            Create One Now
          </Link>
        </div>
      )}
      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-2 min-h-100">
          <h1 className="text-4xl text-accent-300 relative top-6 text-center font-bold">
            {isOwner ? "Your" : user.username + "'s"} Listings
          </h1>
          <ListingGrid listings={listings} />
        </div>
      )}
    </div>
  );
};

export default UserAllListings;
