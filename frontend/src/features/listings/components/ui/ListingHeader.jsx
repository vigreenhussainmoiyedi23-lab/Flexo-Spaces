// ListingHeader.jsx
import { MenuSquare,X } from "lucide-react";
import React from "react";

const ListingHeader = ({
  sortBy,
  setSortBy,
  itemCount,
  search,
  setSearch,
  setIsMenuOpen,
  isMenuOpen,
}) => {
  return (
    <div className="fixed top-[10vh] left-0 lg:left-80 right-0 z-10 bg-brand-900 border-b border-brand-700 px-6 py-5 flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between">
      <button
        onClick={() => {
          setIsMenuOpen((prev) => !prev);
        }}
        className="flex items-center gap-2 lg:hidden active:scale-96 bg-accent-500 text-brand-900 rounded-lg px-3 py-2"
      >
        {isMenuOpen ? (
          <>
          Close <X/>
          </>
        ) : (
          <>
            Filters 
            <MenuSquare />
          </>
        )}
      </button>

      <div className="flex-1 max-w-lg w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search hoodies, sarees, jeans..."
          className="w-full bg-brand-800 border border-brand-700 focus:border-accent-400 rounded-2xl px-6 py-3 text-sm focus:outline-none"
        />
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-brand-800 border border-brand-700 rounded-2xl px-6 py-3 text-sm focus:outline-none cursor-pointer"
        >
          <option value="newest" className=" bg-brand-900 text-accent-300">
            Newest First
          </option>
          <option value="oldest" className=" bg-brand-900 text-accent-300">
            Oldest First
          </option>
          <option value="price-low" className=" bg-brand-900 text-accent-300">
            Price: Low to High
          </option>
          <option value="price-high" className=" bg-brand-900 text-accent-300">
            Price: High to Low
          </option>
        </select>

        <div className="text-sm text-brand-400 whitespace-nowrap">
          {itemCount} items
        </div>
      </div>
    </div>
  );
};

export default ListingHeader;
