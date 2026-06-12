// ListingGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

const     ListingGrid = ({ spaces ,noneMessage}) => {
  return (
    <div className=" p-2   ">
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3 sm:gap-4">
        
        {spaces.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;