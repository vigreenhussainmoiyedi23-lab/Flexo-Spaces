import useBooking from "../../hooks/useBooking";

function UserCTA({ status, bookingId }) {
  const { withdrawBookingHandler } = useBooking();
  return (
    <>
      {status === "pending" && (
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to withdraw this booking?",
            );

            if (!confirmed) return;

            withdrawBookingHandler(bookingId);
          }}
          className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
        >
          Withdraw
        </button>
      )}
    </>
  );
}

export default UserCTA;
