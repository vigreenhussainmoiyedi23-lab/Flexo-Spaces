import React from "react";
import { MapPin } from "lucide-react";
import { useSpace } from "../../hooks/useSpace";
const SPACE_TYPES = [
  "Hot Desk", // Flexible shared seating
  "Dedicated Desk", // Assigned personal desk in a shared room
  "Private Office", // Private, lockable room for individuals or teams
  "Meeting Room", // Hourly conference/board rooms
  "Virtual Office", // Business address and mail handling only
  "Event Space", // Large open halls for workshops or networking
];
const AMENITY_LABELS = {
  enterpriseWifi: "Enterprise Wi-Fi",
  videoConferencing: "4K Video Conferencing",
  podcastStudio: "Soundproof Podcast Studio",
  smartBoard: "Smart Board / Projector",
  printerAccess: "Printing & Scanning Station",

  gym: "On-site Gym & Fitness Center",
  ergonomicFurniture: "Ergonomic Standing Desks",
  outdoorSpace: "Rooftop / Terrace Garden",
  meditationRoom: "Quiet Meditation Room",
  nursingRoom: "Mother's Nursing Room",

  baristaCoffee: "Barista-Crafted Coffee",
  stockedKitchen: "Fully Stocked Pantry",
  cateringService: "On-site Catering",
  kombuchaOnTap: "Kombucha & Cold Brew on Tap",

  access247: "24/7 Keycard Access",
  petFriendly: "Pet Friendly Workspace",
  evCharging: "EV Charging Stations",
  showers: "End-of-Trip Showers & Lockers",
  secureParking: "Secure Covered Parking",
};
const FiltersSidebar = () => {
  const { filters, clearFilters, updateFilters, updatePricing } = useSpace();

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateFilters("lat", position.coords.latitude);
        updateFilters("lng", position.coords.longitude);
      },
      () => {
        alert("Location permission denied");
      },
    );
  };

  const toggleAmenity = (amenity) => {
    const exists = filters.amenities.includes(amenity);

    updateFilters(
      "amenities",
      exists
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity],
    );
  };

  return (
    <aside className="bg-brand-900 border-r border-brand-700 p-6 flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-brand-100">Filters</h2>

      {/* Nearby */}
      <button
        onClick={handleUseLocation}
        className="bg-brand-200 mb-6 active:scale-95 text-brand-900 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <MapPin size={18} />
        Find Nearby Listings
      </button>

      {/* Space Type */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Space Type</h3>

        <select
          value={filters.spaceType}
          onChange={(e) => updateFilters("spaceType", e.target.value)}
          className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
        >
          <option value="all">All Spaces</option>
          {SPACE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Capacity */}
      <div className="mb-6">
        <h2 className=" font-medium mb-3">Capacity</h2>
        <h3 className="text-xs">Minimum Capacity</h3>
        <input
          type="number"
          min="0"
          value={filters.capacity[0]}
          onChange={(e) =>
            updateFilters("capacity", [
              Number(e.target.value),
              filters.capacity[1],
            ])
          }
          className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
          placeholder="Seats"
        />
        <h3 className="text-xs mt-3">Maximum Capacity</h3>
        <input
          type="number"
          min="0"
          value={filters.capacity[1]}
          onChange={(e) =>
            updateFilters("capacity", [
              filters.capacity[0],
              Number(e.target.value),
            ])
          }
          className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
          placeholder="Seats"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Price Range</h3>

        <div className="space-y-3 text-text-primary">
          <input
            type="number"
            min="0"
            value={filters.pricing.rate[0]}
            onChange={(e) =>
              updatePricing({
                rate: [Number(e.target.value), filters.pricing.rate[1]],
              })
            }
            className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
            placeholder="Minimum Price"
          />

          <input
            type="number"
            min="0"
            value={filters.pricing.rate[1] ?? ""}
            onChange={(e) =>
              updatePricing({
                rate: [
                  filters.pricing.rate[0],
                  e.target.value ? Number(e.target.value) : null,
                ],
              })
            }
            className="w-full outline-0 bg-text-primary text-brand-100 border placeholder:text-brand-100 border-brand-300 rounded-xl p-3"
            placeholder="Maximum Price"
          />
        </div>
      </div>

      {/* Billing Interval */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Billing Interval</h3>

        <select
          value={filters.pricing.interval}
          onChange={(e) =>
            updatePricing({
              interval: e.target.value,
            })
          }
          className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
        >
          <option value="all">All</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Amenities</h3>

        <div className="space-y-2">
          {Object.keys(AMENITY_LABELS).map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="accent-accent-400"
              />
              {AMENITY_LABELS[amenity]}
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Sort By</h3>

        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters("sortBy", e.target.value)}
          className="w-full outline-0 bg-text-primary text-brand-100 border border-brand-700 rounded-xl p-3"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="capacity-high">Highest Capacity</option>
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="mt-auto bg-brand-500 rounded-full py-2 block font-bold text-red-500 hover:text-red-400 transition-colors"
      >
        Clear All Filters
      </button>
    </aside>
  );
};

export default FiltersSidebar;
