import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoriesSlider = () => {
  const CLOTHING_TYPES = {
    Tops: ["T-Shirt", "Shirt", "Polo Shirt", "Hoodie"],
    Bottoms: ["Jeans", "Trousers", "Shorts"],
    Dresses: ["Mini Dress", "Maxi Dress"],
    Outerwear: ["Jacket", "Coat", "Blazer"],
    Ethnic: ["Saree", "Kurta", "Lehenga"],
  };

  const CATEGORIES = Object.keys(CLOTHING_TYPES);

  const categoryMedia = {
    Tops: "/productImages/ryan-hoffman-6Nub980bI3I-unsplash.jpg",
    Bottoms: "/productImages/tuananh-blue-9yoXrG6Er_g-unsplash.jpg",
    Dresses: "/productImages/miniDress.jpg",
    Outerwear: "/Hero/denimJacket.webp",
    Ethnic: "/productImages/ethnic.jpg", // FIX THIS IMAGE
  };

  return (
    <section className="w-full bg-brand-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl playfair font-semibold text-white">
            Browse By Categories
          </h2>
          <p className="text-brand-200 montserrat text-sm mt-3">
            Jump into a category and discover what people are swapping
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/listings?category=${encodeURIComponent(category)}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-brand-800 shadow-lg shadow-black/30 hover:border-accent-500/30 transition"
              >
                {/* Image */}
                <div className="relative h-48">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      backgroundImage: `url(${categoryMedia[category]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-brand-900/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white playfair text-xl font-semibold">
                        {category}
                      </p>
                      <p className="text-brand-200 text-sm mt-1">
                        {CLOTHING_TYPES[category]?.length || 0} types
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/25 flex items-center justify-center group-hover:scale-110 transition">
                      <span className="text-accent-500 font-semibold">→</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {CLOTHING_TYPES[category].map((t) => (
                      <span
                        key={t}
                        className="text-xs montserrat px-3 py-1 rounded-full bg-brand-700 text-brand-100 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSlider;