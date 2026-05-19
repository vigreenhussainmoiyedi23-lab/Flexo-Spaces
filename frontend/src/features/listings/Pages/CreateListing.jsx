import React, { useState, useEffect } from "react";
import { useListing } from "../hooks/useListing";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../commonComponents/LocationSelector";

// Constants
const CLOTHING_TYPES = {
  Tops: ["T-Shirt", "Shirt", "Polo Shirt", "Hoodie"],
  Bottoms: ["Jeans", "Trousers", "Shorts"],
  Dresses: ["Mini Dress", "Maxi Dress"],
  Outerwear: ["Jacket", "Coat", "Blazer"],
  Ethnic: ["Saree", "Kurta", "Lehenga"],
};

const CATEGORIES = Object.keys(CLOTHING_TYPES);
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXL+"];
const CONDITIONS = ["new", "like_new", "good", "fair", "poor"];

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
    category: "",
    clothingType: "",
    brandName: "",
    size: "",
    condition: "",
  });
  const { createListing } = useListing();
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  // Dynamic Clothing Types
  useEffect(() => {
    if (formData.category) {
      setAvailableTypes(CLOTHING_TYPES[formData.category] || []);
      setFormData((prev) => ({ ...prev, clothingType: "" }));
    }
  }, [formData.category]);

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
    let ListingData = new FormData();
    ListingData.append("title", formData.title);
    ListingData.append("description", formData.description);
    ListingData.append("category", formData.category);
    ListingData.append("clothingType", formData.clothingType);
    ListingData.append("brandName", formData.brandName);
    ListingData.append("size", formData.size);
    ListingData.append("condition", formData.condition);
    ListingData.append("location", JSON.stringify(location));
    selectedImages.map((img) => ListingData.append("images", img.file));
    setFormData({
      title: "",
      description: "",
      category: "",
      clothingType: "",
      brandName: "",
      size: "",
      condition: "",
    });
    setSelectedImages([]);
    try {
      await createListing(ListingData);
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="min-h-screen pt-[10vh] bg-brand-900 px-4 sm:px-6 lg:px-8 py-6 font-['Montserrat']">
      <div className="max-w-4xl mx-auto bg-white mt-3 rounded-4xl  shadow-sm border border-[#e5e7eb] overflow-hidden">
        {/* Header */}
        <header className="bg-bg-main px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-brand-900">
          <h1 className="font-['Playfair'] text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
            Create New Listing
          </h1>
          <p className="text-xs sm:text-sm text-brand-900">
            List your item for the community
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
        >
          {/* Image Upload */}
          <section>
            <label className="block font-semibold sm:font-bold mb-3 sm:mb-4 text-sm sm:text-base text-[#2e3f59]">
              Product Images
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

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb] bg-white outline-none"
                onChange={handleInputChange}
                value={formData.category}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Clothing Type
              </label>
              <select
                name="clothingType"
                disabled={!formData.category}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb] bg-white outline-none disabled:bg-gray-100"
                onChange={handleInputChange}
                value={formData.clothingType}
              >
                <option value="">Select Type</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Size
              </label>
              <select
                name="size"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={handleInputChange}
              >
                <option value="">Choose Size</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Condition
              </label>
              <select
                name="condition"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={handleInputChange}
              >
                <option value="">Item Condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Brand Name
              </label>
              <input
                name="brandName"
                type="text"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-[#e5e7eb]"
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Description */}
          <div>
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
