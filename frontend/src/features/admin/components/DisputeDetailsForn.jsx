import { useState } from "react";
import useAdmin from "../hooks/useAdmin";

export default function DisputeDetail({
  disputeId,
  actionToBeDone,
  setCurrentDisputeId,
}) {
  const { ResolveDisputeHandler } = useAdmin();
  const [form, setForm] = useState({
    resolution: "FAVOR_REQUESTER",
    adminNote: "",
  });
  let values = [
    "FAVOR_REQUESTER",
    "FAVOR_OWNER",
    "NO_FAULT",
    "REFUND",
    "CANCEL_SWAP",
  ];
  return (
    <div className="bg-brand-800 p-6 rounded text-accnet-500 border absolute min-w-100 w-1/2 top-1/2 left-1/2 -translate-1/2">
      <h2 className="playfair text-xl mb-4">
        {actionToBeDone === "resolved" ? "Resolve" : "Reject"} Dispute
        <p>{disputeId.slice(-5)}</p>
      </h2>
      <button
        onClick={() => setCurrentDisputeId(null)}
        className="absolute top-4 right-1 bg-red-500 text-white rounded-lg px-3 py-1"
      >
        Close
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ResolveDisputeHandler(disputeId, { ...form, status: actionToBeDone });
        }}
        className="flex flex-col"
      >
        <select
          value={form.resolution}
          onChange={(e) => setForm({ ...form, resolution: e.target.value })}
          className="w-full p-2 border mb-3"
        >
          <option className="bg-brand-900 text-white">FAVOR_REQUESTER</option>
          <option className="bg-brand-900 text-white">FAVOR_OWNER</option>
          <option className="bg-brand-900 text-white">NO_FAULT</option>
          <option className="bg-brand-900 text-white">REFUND</option>
          <option className="bg-brand-900 text-white">CANCEL_SWAP</option>
        </select>

        <textarea
          value={form.adminNote}
          onChange={(e) => setForm({ ...form, adminNote: e.target.value })}
          placeholder="Admin note..."
          className="w-full p-2 border mb-3"
          required
        />
      </form>

      <button
        onClick={async () => {
          await ResolveDisputeHandler(disputeId, {
            ...form,
            status: actionToBeDone,
          });
          setCurrentDisputeId(null);
        }}
        className="bg-accent-500 active:scale-95 text-brand-900 px-4 py-2 source-code-pro rounded"
      >
        Submit Resolution
      </button>
    </div>
  );
}
