import useBooking from "../../hooks/useBooking";
function OwnerCTA({ status, bookingId }) {
  const { acceptBookingHandler, rejectBookingHandler,completeBookingHandler } = useBooking();
  return (
    <div className="flex gap-3">
      {status === "pending" && (
        <>
          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to reject this booking?",
              );

              if (!confirmed) return;
              rejectBookingHandler(bookingId);
            }}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Reject
          </button>

          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to accept this booking as other bookings may be rejected?",
              );

              if (!confirmed) return;
              acceptBookingHandler(bookingId);
            }}
            className="flex-1 rounded-lg bg-yellow-300 px-4 py-2 font-medium text-text-primary transition hover:bg-brand-200"
          >
            Accept
          </button>
        </>
      )}
      {status === "accepted" && (
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to complete this booking?",
            );

            if (!confirmed) return;
            completeBookingHandler(bookingId);
          }}
          className="flex-1 rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600"
        >
          Complete
        </button>
      )}
    </div>
  );
}

export default OwnerCTA;
