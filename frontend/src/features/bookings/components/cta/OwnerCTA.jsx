function OwnerCTA({ status }) {
  return (
    <div className="flex gap-3">
      {status === "pending" && (
        <>
          <button
            onClick={() => console.log("Reject")}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Reject
          </button>

          <button
            onClick={() => console.log("Accept")}
            className="flex-1 rounded-lg bg-yellow-300 px-4 py-2 font-medium text-text-primary transition hover:bg-brand-200"
          >
            Accept
          </button>
        </>
      )}
    </div>
  );
}

export default OwnerCTA;
