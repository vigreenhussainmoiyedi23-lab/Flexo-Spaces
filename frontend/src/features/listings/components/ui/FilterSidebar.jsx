// FiltersSidebar.jsx
import { MapPin } from "lucide-react";
import React from "react";

const FiltersSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedTypes,
  setSelectedTypes,
  selectedSizes,
  setSelectedSizes,
  selectedConditions,
  setSelectedConditions,
  clearAllFilters,
  CATEGORIES,
  CLOTHING_TYPES,
  SIZES,
  CONDITIONS,
  toggleArray,
  coordinates, // {lat,lng}
  setCoordinates,
    sortBy,
  setSortBy,
  itemCount
}) => {
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoordinates({ lat, lng }); // ✅ THIS is what you need
      },
      (error) => {
        console.error(error);
        alert("Location permission denied");
      },
    );
  };
  return (
    <div className=" flex   bg-brand-900 overflow-y-auto border-r border-brand-700 p-6 flex-col">
      <h2 className="text-2xl font-semibold mb-8 text-brand-100">Filters</h2>
      <button
        className="bg-accent-500 mb-3 active:scale-96 text-brand-900 px-3 py-2 rounded-lg source-code-pro font-bold text-lg flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={handleUseLocation}
      >
        <MapPin size={20} />
        Find Nearby Listings
      </button>
      {/* Category */}
      <div className="mb-8">
        <h3 className="font-medium mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              selectedCategory === "All"
                ? "bg-accent-400 text-brand-900 font-medium"
                : "bg-brand-800 hover:bg-brand-700"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-accent-400 text-brand-900 font-medium"
                  : "bg-brand-800 hover:bg-brand-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Types (only when category selected) */}
      {selectedCategory !== "All" && CLOTHING_TYPES[selectedCategory] && (
        <div className="mb-8">
          <h3 className="font-medium mb-3">Type</h3>
          <div className="space-y-2">
            {CLOTHING_TYPES[selectedCategory].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() =>
                    toggleArray(selectedTypes, setSelectedTypes, type)
                  }
                  className="accent-accent-400"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      )}
      {/* sortBy */}
      <div className="flex lg:hidden items-center gap-4">
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
      {/* Sizes */}
      <div className="mb-8">
        <h3 className="font-medium mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleArray(selectedSizes, setSelectedSizes, size)}
              className={`px-4 py-2 text-sm rounded-xl transition-all border ${
                selectedSizes.includes(size)
                  ? "bg-accent-400 text-brand-900 border-accent-400"
                  : "bg-brand-800 border-brand-700 hover:border-accent-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-8">
        <h3 className="font-medium mb-3">Condition</h3>
        <div className="space-y-2">
          {CONDITIONS.map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-2 cursor-pointer capitalize text-sm"
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(cond)}
                onChange={() =>
                  toggleArray(selectedConditions, setSelectedConditions, cond)
                }
                className="accent-accent-400"
              />
              {cond.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearAllFilters}
        className="mt-auto text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FiltersSidebar;
