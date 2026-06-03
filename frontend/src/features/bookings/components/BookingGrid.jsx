import BookingCard from "./BookingCard";

const urgencyLevels = ["normal", "warning", "critical", "danger"];
import useAuth from "../../auth/hooks/useAuth";
import UserCTA from "./cta/UserCTA";
import OwnerCTA from "./cta/OwnerCTA";
import { Link } from "react-router-dom";
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
      {bookings.length === 0 && (
        <div className="col-span-4 w-full h-[90vh] flex flex-col items-center justify-center text-center text-gray-400">
          No bookings found
          <Link to={"/spaces"} className="bg-brand-500 exo-2 text-text-primary p-2 rounded-full">
          Browse Spaces To create Bookings
          </Link>
        </div>
      )}
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
