import React from "react";

const ShippingAddressShowcase = ({
  ownerAddress,
  requesterAddress,
  otherUserRole,
  setShowAddress,
}) => {
  const address = otherUserRole === "owner" ? ownerAddress : requesterAddress;
  return (
    <div className="fixed z-20 inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white text-gray-800 p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Shipping Address
        </h2>

        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {Object.entries(address).map(([key, value]) => (
            <React.Fragment key={key}>
              <span className="text-gray-500 capitalize">{key}</span>
              <span className="font-medium text-right">{value}</span>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => setShowAddress(false)}
          className="mt-6 w-full bg-brand-500 text-white py-2 rounded-lg hover:bg-brand-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShippingAddressShowcase;
