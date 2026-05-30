import BookingCard from "./BookingCard";

const urgencyLevels = [
  "normal",
  "warning",
  "critical",
  "danger",
];

export default function BookingGrid({
  bookings,
}) {
  return (
    <section
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-6
    "
    >
      {bookings.map((booking, index) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          urgency={
            urgencyLevels[
              index % urgencyLevels.length
            ]
          }
          cta={
            <button
              className="
              w-full
              py-3
              rounded-2xl
              bg-brand-500
              text-white
              font-bold
            "
            >
              View Booking
            </button>
          }
        />
      ))}
    </section>
  );
}