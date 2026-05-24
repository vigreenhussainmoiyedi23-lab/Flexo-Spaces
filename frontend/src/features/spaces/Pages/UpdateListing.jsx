import React, { useState, useEffect } from "react";
import { useSpace } from "../hooks/useSpace";
import { useNavigate, useParams } from "react-router-dom";

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

const updateSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSpaceById, updateSpace, loading } = useSpace();
  const [space, setSpace] = useState(null);
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

  const [images, setImages] = useState([]);

  // 🔥 Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      const data = await getSpaceById(id);
      setSpace(data.Space);
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (!space) return;
    setFormData({
      title: space?.title || "",
      description: space?.description || "",
      spaceType: space?.spaceType || "",
      capacity: space?.capacity || 1,
      pricing: {
        rate: space?.pricing?.rate || 0,
        interval: space?.pricing?.interval || "",
      },
      amenities: space?.amenities || [],
    });
    setImages(space.images || []);
  }, [space]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSpace(id, formData);
      navigate("/spaces");
      
    } catch (error) {
      console.error("Error updating space:", error);
    }
  };

  return (
    <div className="min-h-screen pt-[10vh] bg-brand-100 px-4 py-6 font-['Montserrat']">
      <div className="max-w-4xl mx-auto bg-white mt-3 rounded-4xl shadow-sm border overflow-hidden">
        {/* Header */}
        <header className="bg-text-primary text-brand-100 tracking-wider px-6 py-6 ">
          <h1 className="font-['Playfair'] text-3xl font-bold">
            Update Listing
          </h1>
          <p className="text-sm">Edit your item details</p>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* 🔒 Images (READ ONLY) */}
          <section>
            <label className="block font-bold mb-4 text-[#2e3f59]">
              Product Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={img.url}
                    alt="listing"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Images cannot be edited
            </p>
          </section>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
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
                value={formData.capacity}
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
                value={formData.pricing.interval}
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
                value={formData.pricing.rate}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border"
            />
          </div>
          {/* Button */}
          <button
            type={loading ? "button" : "submit"}
            className="w-full py-4 active:scale-96 bg-[#32674e] text-[#fdfab7] font-bold rounded-lg hover:bg-[#274135]"
          >
            {loading ? "Updating.." : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default updateSpace;
