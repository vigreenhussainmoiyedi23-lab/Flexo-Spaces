import { MenuSquare } from "lucide-react";
import React from "react";

const SwapFilters = ({
  activeFilter,
  setActiveFilter,
  shipment_type,
  setShipment_type,
}) => {
  const filters = [
    { label: "All Swaps", value: "all" },
    { label: "Incoming Requests", value: "incoming" },
    { label: "Sent Requests", value: "sent" },
    { label: "Active Swaps", value: "active" },
    { label: "Completed Swaps", value: "completed" },
    { label: "Declined Swaps", value: "declined" },
  ];

  return (
    <div className="w-full   min-h-screen bg-brand-900 border-r border-brand-700 p-5 text-white">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Status Filters */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Swap Status</p>

        <div className="flex flex-col gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveFilter(item.value)}
              className={`text-left px-4 py-2 rounded-lg transition ${
                activeFilter === item.value
                  ? "bg-accent-500 text-black font-medium"
                  : "bg-brand-700 hover:bg-brand-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-brand-700" />

      {/* Optional Extra Filters */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Shipping Type</p>
       
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShipment_type("all")}
            style={shipment_type == "all" ? { backgroundColor: "green" } : null}
            className="bg-brand-700 hover:bg-brand-500 px-4 py-2 rounded-lg text-left"
          >
            All Shipment Types
          </button>
          <button
            onClick={() => setShipment_type("local_swap")}
            style={
              shipment_type == "local_swap"
                ? { backgroundColor: "green" }
                : null
            }
            className="bg-brand-700 hover:bg-brand-500 px-4 py-2 rounded-lg text-left"
          >
            Local Swap
          </button>
          <button
            onClick={() => setShipment_type("shipping")}
            style={
              shipment_type == "shipping" ? { backgroundColor: "green" } : null
            }
            className="bg-brand-700 hover:bg-brand-500 px-4 py-2 rounded-lg text-left"
          >
            Shipping
          </button>
        </div>
      </div>

      {/* Clear Button */}
      <button className="mt-8 text-red-400 text-sm hover:underline">
        Clear Filters
      </button>
    </div>
  );
};

export default SwapFilters;
