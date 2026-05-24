import React, { useState, useEffect } from "react";
import {  useSpace } from "../hooks/useSpace";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../commonComponents/LocationSelector";



const SPACE_TYPES = [
  "Hot Desk", // Flexible shared seating
  "Dedicated Desk", // Assigned personal desk in a shared room
  "Private Office", // Private, lockable room for individuals or teams
  "Meeting Room", // Hourly conference/board rooms
  "Virtual Office", // Business address and mail handling only
  "Event Space", // Large open halls for workshops or networking
];

// ⏱️ Allowed billing intervals for commercial bookings
const PRICING_INTERVALS = ["hourly", "daily", "weekly", "monthly"];


// 🏷️ Human-readable labels for your Frontend UI UI rendering
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
const CreateListing = () => {
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    lat: 0,
    log: 0,
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    spaceType: "",
    capacity: 1,
    pricing: {
      rate: 0,
      interval: "",
    },
    amenities: [],
  });
  
  const { createSpace } = useSpace();
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const filePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...filePreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.pricing.rate = Number(formData.pricing.rate);
    let ListingData = new FormData();
    ListingData.append("title", formData.title);
    ListingData.append("description", formData.description);
    ListingData.append("spaceType", formData.spaceType);
    ListingData.append("capacity", formData.capacity);
    ListingData.append("pricing[rate]", formData.pricing.rate);
    ListingData.append("pricing[interval]", formData.pricing.interval);
    formData.amenities.forEach((item) => {
      ListingData.append("amenities[]", item);
    });
    ListingData.append("location", JSON.stringify(location));

    selectedImages.map((img) => ListingData.append("images", img.file));
    try {
      await createSpace(ListingData);
      setFormData({
        title: "",
        description: "",
        spaceType: "",
        capacity: 1,
        pricing: {
          rate: 0,
          interval: "",
        },
        amenities: [],
      });
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="min-h-screen pt-[10vh] bg-brand-900 px-4 sm:px-6 lg:px-8 py-6 font-['Montserrat']">
      <div className="max-w-4xl mx-auto bg-white mt-3 rounded-4xl  shadow-sm border border-[#e5e7eb] overflow-hidden">
        {/* Header */}
        <header className="bg-text-primary px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-bg-main">
          <h1 className="exo-2 text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
            Create New WorkSpace
          </h1>
          <p className="text-xs sm:text-sm text-bg-main">
            List your Space for the community
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
        >
          {/* Image Upload */}
          <section>
            <label className="block font-semibold sm:font-bold mb-3 sm:mb-4 text-sm sm:text-base text-[#2e3f59]">
              WorkSpace Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-[#d1d5db]"
                >
                  <img
                    src={img.url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-[#dc2626]"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Upload Box */}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[#d1d5db] rounded-lg cursor-pointer hover:bg-[#f2f0ec] transition-colors">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-[#6b7280]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs mt-2 text-[#6b7280]">
                  Add Photo
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </section>
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <LocationSelector location={location} setLocation={setLocation} />
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Title
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Vintage Silk Saree"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb] focus:ring-2 focus:ring-[#32674e] outline-none"
                onChange={handleInputChange}
              />
            </div>
            {/* Description */}
            <div className=" md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                placeholder="Tell us about the fabric, fit, and history..."
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                min={1}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Space Type
              </label>
              <select
                name="spaceType"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb] bg-white outline-none"
                onChange={handleInputChange}
                value={formData.spaceType}
              >
                <option value="">Select space Type</option>
                {SPACE_TYPES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Pricing Interval
              </label>
              <select
                name="pricing"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      interval: e.target.value,
                    },
                  }));
                }}
              >
                <option value="">Choose Pricing Interval</option>
                {PRICING_INTERVALS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
              <input
                type="number"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      rate: e.target.value,
                    },
                  }));
                }}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Pricing Rate (INR)
              </label>
              <input
                name="pricing rate"
                type="number"
                min={1}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      rate: e.target.value,
                    },
                  }));
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-text-primary rounded-lg p-2">
            <h3 className="text-2xl text-center underline underline-offset-5">
              Amenities
            </h3>
            {Object.entries(AMENITY_LABELS).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={key}
                  checked={formData.amenities.includes(key)}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      amenities: checked
                        ? [...prev.amenities, value]
                        : prev.amenities.filter((a) => a !== value),
                    }));
                  }}
                />
                {label}
              </label>
            ))}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 sm:py-4 text-sm sm:text-base bg-[#32674e] text-[#fdfab7] font-bold rounded-lg hover:bg-[#274135] transition-all shadow-lg active:scale-[0.98]"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
