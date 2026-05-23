// ProductCard.jsx
import React, { useState } from "react";
import { MapPin, Star, Users } from "lucide-react";
import useAuth from "../../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { useSpace } from "../../hooks/useSpace";

const ProductCard = ({ item }) => {
  const { user } = useAuth();
  const { deleteListing } = useSpace();

  return (
    <section
      className="group block  bg-text-primary w-full h-full rounded-3xl overflow-hidden
                 border border-white/5 shadow-[0_2px_24px_0_rgba(0,0,0,0.18)]
                 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0.28)]
                 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer
                 relative"
    >
      {/* Removed-by-admin overlay */}
      {item.isRemoved && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-3xl">
          <span className="bg-black/80 border border-red-500/40 text-red-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full">
            Removed by Admin
          </span>
        </div>
      )}
      <Link to={`/spaces/more/${item._id}`}>
        {/* ── Image section ─────────────────────────────── */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
          <img
            src={item?.images[0]?.url}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-500
            group-hover:scale-105
            ${item.isRemoved ? "grayscale opacity-60" : ""}`}
          />

          {/* Gradient fade at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Space-type badge — top-left */}
          <span
            className="absolute top-3 left-3 bg-accent-500/90 backdrop-blur-sm
          text-white text-[10px] font-bold uppercase tracking-widest
          px-2.5 py-1 rounded-full"
          >
            {item.spaceType.replace(/_/g, " ")}
          </span>

          {/* Capacity pill — bottom-left inside image */}
          {item?.capacity && (
            <span
              className="absolute bottom-3 left-3 flex items-center gap-1
          bg-black/50 backdrop-blur-sm text-white/90
          text-[10px] font-semibold px-2.5 py-1 rounded-full"
            >
              <Users className="w-3 h-3" />
              {item.capacity}
            </span>
          )}
        </div>

        {/* ── Body ──────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-2">
          {/* Title */}

          {/* Price */}
          <div className="flex-shrink-0 flex items-center justify-between text-start">
            <h3
              className="font-bold text-brand-100 text-base sm:text-lg leading-snug
            line-clamp-2 capitalize tracking-tight"
            >
              {item.title}
            </h3>
            <p className="text-brand-100 font-extrabold text-lg leading-none tracking-tight">
              ₹{item?.pricing?.rate} / {item?.pricing?.interval.slice(0,-2)}
            </p>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 mt-1 text-brand-100/70 text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate capitalize">
              {item.location.city}, {item.location.state}
            </span>
          </p>

          {/* Description */}
          <p className="text-brand-100/70 text-xs mt-2 line-clamp-2 capitalize leading-relaxed">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {item.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 rounded-full bg-brand-100 border border-white/10
                 text-[10px] text-text-secondary font-bold"
              >
                {amenity}
              </span>
            ))}

            {item.amenities.length > 4 && (
              <span
                className="px-2 py-1 rounded-full bg-accent-500/10
                 text-[10px] text-accent-300"
              >
                +{item.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-4 my-3 h-px bg-white/5" />

      {/* ── Owner row ─────────────────────────── */}
      <Link
        to={`/profile/${item.owner._id}`}
        className="px-4 pb-4 flex items-center justify-between gap-3"
      >
        {/* Owner */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={item.owner.profilePicture}
              alt={item.owner.username}
              className={`w-10 h-10 rounded-full object-cover ring-2 ring-accent-500/30
                          ${item.isRemoved ? "grayscale" : ""}`}
            />
            {/* online dot */}
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400
                             rounded-full border-2 border-brand-500"
            />
          </div>
          <div className="min-w-0">
            <p className="text-accent-200 text-xs font-semibold truncate capitalize">
              {item.owner.username}
            </p>
            <p className="flex items-center gap-0.5 text-[10px] text-brand-200/60">
              <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
              <span>{item.owner.rating}</span>
            </p>
          </div>
        </div>
      </Link>

      {/* ── Book CTA ──────────────────────────────────── */}
      <div className="px-4 pb-4">
        <div
          className="w-full py-3 rounded-2xl text-center text-sm font-bold tracking-wide
                     bg-accent-500 text-white
                     group-hover:bg-accent-400
                     active:scale-95 transition-all duration-200"
        >
          Book Now
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
