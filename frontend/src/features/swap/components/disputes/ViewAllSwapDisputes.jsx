import { useEffect, useState } from "react";
import useSwap from "../../hooks/useSwap";

const ViewAllSwapDisputes = ({ swapId, setShowDisputes }) => {
  const { getSwapAllDisputesHandler, loading, swapAllDisputes } = useSwap();

  useEffect(() => {
    getSwapAllDisputesHandler(swapId);
  }, [swapId]);

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
      <div className="bg-brand-700 w-full max-w-2xl p-6 rounded-2xl text-white montserrat relative">
        {/* Close */}
        <button
          onClick={() => setShowDisputes(false)}
          className="absolute right-4 top-4 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Swap Disputes</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !swapAllDisputes || swapAllDisputes.length === 0 ? (
          <p className="text-text-muted">No disputes found.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {swapAllDisputes.map((d) => (
              <div
                key={d._id}
                className="bg-brand-800 relative p-4 rounded-xl border border-border"
              >
                <p className="text-accent-500 font-semibold playfair text-2xl">
                  {d.type}
                </p>

                <p className="text-sm text-brand-200 montserrat">{d.reason}</p>

                <p className="text-xs mt-1 absolute top-4 right-4">
                  By: {d.raisedBy?.username} ({d.role})
                </p>

                {d.description && (
                  <p className="text-lg mt-2 text-brand-400 montserrat">
                    {d.description}
                  </p>
                )}
                <p className="text-xs mt-2 bg-accent-500 w-fit text-brand-900 px-2 py-2 rounded-lg">
                  Status: {d.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllSwapDisputes;
