// ListingGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

const ListingGrid = ({ listings ,noneMessage}) => {
  return (
    <div className="sm:p-6 md:p-8 mt-[20vh] sm:mt-[10vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3 sm:gap-4">
        {listings.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-20 text-brand-400">
          {noneMessage || "No items match your filters. Try clearing some filters."}
        </div>
      )}
    </div>
  );
};

export default ListingGrid;