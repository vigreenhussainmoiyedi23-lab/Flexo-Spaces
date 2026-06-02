import BookingCard from "./BookingCard";

const urgencyLevels = ["normal", "warning", "critical", "danger"];
import useAuth from "../../auth/hooks/useAuth";
import UserCTA from "./cta/UserCTA";
import OwnerCTA from "./cta/OwnerCTA";
export default function BookingGrid({ bookings }) {
  const { user } = useAuth();
  return (
    <section
      className="
      grid
      grid-cols-1
      md:grid-cols-2  
      lg:grid-cols-3
      xl:grid-cols-4
      gap-6
    "
    >
      {bookings.map((booking, index) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          cta={
            user && user.role === "user" ? (
              <UserCTA status={booking.status} bookingId={booking._id} />
            ) : (
              <OwnerCTA status={booking.status} bookingId={booking._id} />
            )
          }
        />
      ))}
    </section>
  );
}
