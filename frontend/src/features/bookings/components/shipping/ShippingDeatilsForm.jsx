import React, { useState } from "react";
import useSwap from "../../hooks/useSwap";
import Input from "./ui/Input";
import { X } from "lucide-react";

const ShippingDetailsForm = ({ swapId, setShowForm }) => {
  const { shipmentDetailsHandler } = useSwap();

  const COURIERS = [
    "delhivery",
    "bluedart",
    "dtdc",
    "indiapost",
    "ekart",
    "xpressbees",
    "amazon",
    "flipkart",
    "other",
  ];

  const [form, setForm] = useState({
    courier: "delhivery",
    customCourier: "",
    trackingId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      courier:
        form.courier === "other" ? form.customCourier : form.courier,
      trackingId: form.trackingId,
    };

    shipmentDetailsHandler(swapId, payload);
  };

  return (
    <div className="fixed z-30 top-0 bottom-0 left-0 right-0 bg-black/40 ">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 rounded-2xl shadow-md flex flex-col gap-4 w-full max-w-lg fixed top-1/2 left-1/2 -translate-1/2"
      >
        <h2 className="text-xl font-semibold text-text-primary">
          Shipment Details
        </h2>

        <h3
          onClick={() => setShowForm(false)}
          className="absolute top-2 right-2 cursor-pointer text-text-primary"
        >
          <X />
        </h3>

        <select
          className="bg-cyan-300 px-3 py-2 text-brand-700"
          value={form.courier}
          onChange={handleChange}
          name="courier"
        >
          {COURIERS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* 👇 Show input only when "other" is selected */}
        {form.courier === "other" && (
          <Input
            label="Custom Courier Name"
            name="customCourier"
            value={form.customCourier}
            onChange={handleChange}
            placeholder="Enter courier name"
          />
        )}

        <Input
          label="Tracking ID"
          name="trackingId"
          value={form.trackingId}
          onChange={handleChange}
          placeholder="Enter tracking number"
        />

        <button
          type="submit"
          className="mt-2 bg-accent-500 text-white py-2 rounded-lg hover:bg-accent-400 transition"
        >
          Add Shipment
        </button>
      </form>
    </div>
  );
};

export default ShippingDetailsForm;