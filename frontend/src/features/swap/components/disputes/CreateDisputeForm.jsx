import { useState } from "react";
import useSwap from "../../hooks/useSwap";

const DISPUTE_TYPES = [
  "NOT_SHIPPED",
  "WRONG_ITEM",
  "DAMAGED_ITEM",
  "FRAUD",
  "OTHER",
];

const CreateDisputeForm = ({ swapId, setShowForm }) => {
  const [form, setForm] = useState({
    type: "NOT_SHIPPED",
    reason: "",
    description: "",
  });
  const { createDisputeHandler, loading } = useSwap();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
      <div className="bg-brand-700 w-full max-w-lg p-6 rounded-2xl text-white montserrat relative">
        {/* Close */}
        <button
          onClick={() => setShowForm(false)}
          className="absolute right-4 top-4 text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Create Dispute</h2>

        {/* Type */}
        <label htmlFor="type">Select Dispute Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-brand-800 mb-3"
        >
          {DISPUTE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Reason */}
        <label htmlFor="type">Enter Dispute Reason</label>
        <input
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason"
          className="w-full p-2 rounded-lg bg-brand-800 mb-3"
        />

        {/* Description */}
        <label htmlFor="type">Enter Dispute Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description "
          className="w-full p-2 rounded-lg bg-brand-800 mb-3"
        />

        <button
          disabled={loading}
          onClick={() => createDisputeHandler(swapId, form)}
          className="w-full bg-accent-500 text-brand-900 font-bold py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Submit Dispute"}
        </button>
      </div>
    </div>
  );
};

export default CreateDisputeForm;
