import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import listingService from "../../listings/service/api.service";

const ListingPreviewCard = ({ item }) => {
  const imageUrl = item?.images?.[0]?.url;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-xl bg-brand-800 border border-white/10 hover:border-accent-500/30 shadow-lg shadow-black/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={item?.title || "Listing"}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-brand-700" />
        )}
        <div className="absolute inset-0 bg-brand-900/35" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white playfair text-lg font-semibold line-clamp-1">
              {item?.title || "Listing"}
            </p>
            <p className="text-brand-200 montserrat text-sm line-clamp-1 mt-1">
              {item?.brand ? `${item.brand} • ` : ""}
              {item?.size ? `Size ${item.size}` : ""}
            </p>
          </div>

          {typeof item?.estimatedValue === "number" && (
            <div className="shrink-0 text-right">
              <p className="text-accent-500 font-semibold">₹ {item.estimatedValue}</p>
              <p className="text-brand-300 text-xs">estimated</p>
            </div>
          )}
        </div>

        {item?.location?.city && (
          <p className="text-brand-300 text-xs mt-3">
            {item.location.city}
            {item?.location?.state ? `, ${item.location.state}` : ""}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const TrendingSwapsPreview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const skeletons = useMemo(() => new Array(6).fill(0), []);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await listingService.getListings({});
        const list = Array.isArray(res?.listings) ? res.listings : [];
        if (mounted) setItems(list.slice(0, 6));
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-brand-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl playfair font-semibold text-white">
              Trending Swaps 
            </h2>
            <p className="text-brand-200 montserrat text-sm mt-3 max-w-2xl">
              A quick preview of what is being listed right now. Explore without signing in.
            </p>
          </div>

          <Link
            to="/listings"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:bg-white/10 transition-colors text-brand-100"
          >
            Browse all listings
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? skeletons.map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-brand-800 border border-white/10 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-brand-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-2/3 bg-brand-700 rounded" />
                    <div className="h-3 w-1/2 bg-brand-700 rounded" />
                    <div className="h-3 w-1/3 bg-brand-700 rounded" />
                  </div>
                </div>
              ))
            : items.map((item, i) => (
                <motion.div
                  key={item?._id || i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link to={`/listings/more/${item._id}`} className="block">
                    <ListingPreviewCard item={item} />
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSwapsPreview;
