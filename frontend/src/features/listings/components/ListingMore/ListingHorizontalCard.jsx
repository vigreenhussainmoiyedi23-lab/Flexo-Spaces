import React from "react";

const ListingHorizontalCard = ({ listing, createSwapHandler }) => {
  if (listing.isLocked || !listing.isAvailable || listing.isRemoved)
    return null;
  return (
    <div className="bg-brand-700 backdrop-blur-2xl h-75 rounded-xl overflow-hidden  w-full max-h-75 xl:max-h-100 flex items-center gap-3">
      <div className="h-full w-1/3 relative">
        <img
          src={listing.images[0].url}
          className="absolute left-0 w-full h-full object-cover rounded-xl"
          alt="listingImage"
        />
      </div>
      <div className="h-full w-2/3 py-2 relative justify-center flex flex-col ">
        <h3 className="text-3xl lg:text-4xl  font-bold text-accent-500 montserrat">
          ₹ {listing.estimatedValue}
        </h3>
        <h1 className="text-3xl capitalize lg:text-4xl xl:text-5xl font-bold text-white playfair ">
          {listing.title}
        </h1>
        <div className=" flex items-center justify-start gap-3 mt-1 mb-2">
          <p className="bg-brand-900 text-white rounded-xl px-3 text-sm">
            {listing.condition.split("_").join(" ")}
          </p>
          <p className="bg-brand-900 text-white rounded-xl px-3 text-sm">
            {listing.clothingType}
          </p>
          <p className="bg-brand-900 text-white rounded-xl px-3 text-sm">
            {listing.size}
          </p>
        </div>
        <p className="text-xs lg:text-sm xl:text-base montserrat text-gray-200 line-clamp-2">
          {listing.description}
        </p>
        <button
          onClick={() => {
            createSwapHandler(listing._id);
          }}
          className="bg-accent-500 border-2 border-brand-900 text-brand-900 font-extrabold w-fit px-5 py-2 rounded-full mt-4 source-code-pro text-lg  tracking-wide hover:bg-accent-300 hover:scale-99 transition-all ease-in-out duration-125 active:scale-95  md:text-xl"
        >
          Offer This Listing
        </button>
      </div>
    </div>
  );
};

export default ListingHorizontalCard;
