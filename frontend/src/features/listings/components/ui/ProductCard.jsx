// ProductCard.jsx
import React from "react";
import {
  Edit,
  LocateFixedIcon,
  LocateIcon,
  MapPin,
  Star,
  Trash,
} from "lucide-react";
import useAuth from "../../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { useListing } from "../../hooks/useListing";
const ProductCard = ({ item }) => {
  const { user } = useAuth();
  const { deleteListing } = useListing();
  return (
    <Link
      to={`/listings/more/${item._id}`}
      className="group bg-white/5 h-fit  w-full backdrop-blur-3xl text-accent-300 rounded-3xl overflow-hidden border border-transparent hover:border-accent-400/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {item.isRemoved && (
        <p className="text-sm absolute top-1/2 left-1/2 -translate-1/2 z-10 bg-black rounded-lg px-3 py-2 text-red-500">
          Removed By Admin
        </p>
      )}
      <div className="flex items-center  gap-2 px-1 mb-2">
    <img
  src={item.owner.profilePicture}
  alt="profilePicture"
  className={`w-12 h-12 rounded-full ${
    item.isRemoved ? "grayscale" : ""
  }`}
/>
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-gray-300">{item.owner.username}</h1>
          <p className="flex items-center gap-1">
            {item.owner.rating} <Star className="stroke-brand-300" />
          </p>
        </div>
      </div>
      <div className="absolute top-4 right-4 text-white bg-accent-500/70 px-3 py-1 rounded-full text-xs font-medium capitalize">
        {item.condition.replace("_", " ")}
      </div>
      <div className="flex lg:flex-col flex-row ">
        <div className="relative aspect-[4/5] overflow-hidden w-1/3 lg:w-full">
          <img
            src={item?.images[0]?.url}
            alt={item.title}
            className="w-full h-full  object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-5 w-full">
          <h3 className="font-semibold  text-lg leading-tight line-clamp-2 capitalize">
            {item.title}
          </h3>
          <p className="flex items-center mt-1 mb-3 text-brand-100 justify-start gap-2 text-xs  whitespace-nowrap">
            <MapPin className="h-4  w-4 " />
            {item.location.city + " , " + item.location.state}
          </p>
          <p className="text-brand-400 text-sm mt-1 flex items-center gap-1 line-clamp-2 capitalize">
            {item.description}
          </p>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs text-brand-500">
                {item.size} • {item.clothingType}
              </p>
            </div>
            {/* You can add price here later */}
            <p className="font-semibold text-lg montserrat text-accent-500 flex flex-col items-center">
              ₹ {item.estimatedValue}
              <span className="text-xs font-light  text-brand-300 ">
                estimated Value
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
