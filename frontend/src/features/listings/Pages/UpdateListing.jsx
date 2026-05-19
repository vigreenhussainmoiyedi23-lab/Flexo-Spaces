import React, { useState, useEffect } from "react";
import { useListing } from "../hooks/useListing";
import { useParams } from "react-router-dom";

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

const UpdateListing = () => {
  const { id } = useParams();
  const { getListingById, updateListing, loading } = useListing();
  const [listingById, setlistingById] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    clothingType: "",
    brandName: "",
    size: "",
    condition: "",
  });

  const [images, setImages] = useState([]); // existing images
  const [availableTypes, setAvailableTypes] = useState([]);

  // 🔥 Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      const data = await getListingById(id);
      setlistingById(data.listing);
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    setFormData({
      title: listingById.title || "",
      description: listingById.description || "",
      category: listingById.category || "",
      clothingType: listingById.clothingType || "",
      brandName: listingById.brandName || "",
      size: listingById.size || "",
      condition: listingById.condition || "",
    });
    setImages(listingById.images || []);
  }, [listingById]);

  // Dynamic clothing types
  useEffect(() => {
    if (formData.category) {
      setAvailableTypes(CLOTHING_TYPES[formData.category] || []);
    }
  }, [formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateListing(id, formData);
  };

  return (
    <div className="min-h-screen pt-[10vh] bg-brand-900 px-4 py-6 font-['Montserrat']">
      <div className="max-w-4xl mx-auto bg-white mt-3 rounded-4xl shadow-sm border overflow-hidden">
        {/* Header */}
        <header className="bg-bg-main px-6 py-6 text-brand-900">
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
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Clothing Type
              </label>
              <select
                name="clothingType"
                value={formData.clothingType}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Select Type</option>
                {availableTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Choose Size</option>
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
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
              <label className="block text-sm font-semibold mb-2">
                Brand Name
              </label>
              <input
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border"
              />
            </div>
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

export default UpdateListing;
