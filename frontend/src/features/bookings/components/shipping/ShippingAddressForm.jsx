// ShippingAddressForm.jsx
import React, { useState } from "react";
import useSwap from "../../hooks/useSwap";
import Input from "./ui/Input";
import { X } from "lucide-react";
import LocationSelector from "../../../commonComponents/LocationSelector";

const ShippingAddressForm = ({ swapId, setShowForm }) => {
  const { shipmentAddressHandler } = useSwap();

  const [form, setForm] = useState({
    street: "",
    pincode: "",
    phone: "",
  });
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    lat: 0,
    log: 0,
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = { ...form, ...location };
    shipmentAddressHandler(swapId, data);
    setShowForm(false);
  };

  return (
    <div className="fixed z-99 top-0 bottom-0 left-0 right-0 bg-black/40 ">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 rounded-2xl  flex flex-col gap-4 w-full max-w-lg fixed top-1/2 left-1/2 -translate-1/2 z-99 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-text-primary">
          Shipping Address
        </h2>
        <h3
          onClick={() => setShowForm(false)}
          className="absolute top-2 right-2 cursor-pointer text-text-primary"
        >
          <X />
        </h3>
        <Input
          label="Street Address"
          name="street"
          value={form.street}
          onChange={handleChange}
        />
        <div className="text-brand-900">
          <LocationSelector location={location} setLocation={setLocation} />
        </div>

        <Input
          label="Pincode"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
        />
        <Input
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="tel"
        />

        <button
          type="submit"
          className="mt-2 bg-accent-500 text-white py-2 rounded-lg hover:bg-accent-400 transition"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
