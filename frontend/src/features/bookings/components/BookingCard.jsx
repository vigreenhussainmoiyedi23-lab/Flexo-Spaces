import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";

const BookingCard = ({
  booking,
  cta,
  urgency = "normal",
}) => {
  const space = booking.space;

  const urgencyStyles = {
    normal: {
      shadow: "",
      badge: "bg-accent-500",
      progress: "bg-accent-500",
    },

    warning: {
      shadow:
        "shadow-[0_0_25px_rgba(224,177,78,0.35)]",
      badge: "bg-brand-200",
      progress: "bg-brand-200",
    },

    critical: {
      shadow:
        "shadow-[0_0_35px_rgba(155,44,78,0.45)]",
      badge: "bg-error",
      progress: "bg-error",
    },

    danger: {
      shadow:
        "shadow-[0_0_45px_rgba(155,44,78,0.7)] animate-pulse",
      badge: "bg-error",
      progress: "bg-error",
    },
  };

  const style = urgencyStyles[urgency];

  return (
    <section
      className={`
      group
      bg-text-primary
      rounded-3xl
      overflow-hidden
      border border-white/5
      transition-all duration-300
      hover:-translate-y-1.5
      ${style.shadow}
    `}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={space.images[0].url}
          alt={space.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* STATUS */}
        <span
          className="
          absolute
          left-3
          top-3
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          uppercase
          bg-warning
          text-text-primary
        "
        >
          {booking.status}
        </span>

        {/* COUNTDOWN */}
        <span
          className={`
          absolute
          right-3
          top-3
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          text-white
          ${style.badge}
        `}
        >
          3h 20m left
        </span>
      </div>

      {/* BODY */}
      <div className="p-4">
        {/* TITLE */}
        <h3
          className="
          text-brand-100
          text-lg
          font-bold
          capitalize
        "
        >
          {space.title}
        </h3>

        {/* LOCATION */}
        <p
          className="
          flex items-center gap-1
          text-brand-100/70
          text-xs
          mt-1
        "
        >
          <MapPin className="w-3 h-3" />
          {space.location.city}, {space.location.state}
        </p>

        {/* DATE */}
        <div
          className="
          mt-4
          flex
          items-center
          gap-2
          text-brand-100
        "
        >
          <Calendar className="w-4 h-4" />

          <span className="text-sm">
            26 Jun → 27 Jun
          </span>
        </div>

        {/* BOOKING TYPE */}
        <p
          className="
          text-brand-100/60
          text-xs
          mt-2
          uppercase
          tracking-widest
        "
        >
          {booking.bookingType}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div
            className="
            bg-white/5
            rounded-2xl
            p-3
          "
          >
            <p className="text-brand-100/50 text-xs">
              Seats
            </p>

            <p className="text-brand-100 font-bold">
              {booking.seatsBooked}/
              {booking.totalCapacitySnapshot}
            </p>
          </div>

          <div
            className="
            bg-white/5
            rounded-2xl
            p-3
          "
          >
            <p className="text-brand-100/50 text-xs">
              Amount
            </p>

            <p className="text-brand-100 font-bold">
              ₹{booking.pricing.finalPrice}
            </p>
          </div>
        </div>

        {/* AMENITIES */}
        <div className="flex flex-wrap gap-2 mt-4">
          {space.amenities
            .slice(0, 4)
            .map((amenity) => (
              <span
                key={amenity}
                className="
                px-2 py-1
                rounded-full
                bg-brand-100
                text-text-primary
                text-[10px]
                font-bold
              "
              >
                {amenity}
              </span>
            ))}
        </div>

        {/* OWNER */}
        <div
          className="
          mt-5
          flex
          items-center
          gap-3
        "
        >
          <img
            src={booking.owner.profilePicture}
            alt={booking.owner.username}
            className="
              w-10
              h-10
              rounded-full
              object-cover
            "
          />

          <div>
            <p
              className="
              text-brand-100/50
              text-xs
            "
            >
              Workspace Owner
            </p>

            <p
              className="
              text-brand-100
              text-sm
              font-semibold
            "
            >
              {booking.owner.username}
            </p>
          </div>
        </div>

        {/* URGENCY */}
        <div className="mt-5">
          <div className="flex justify-between text-xs">
            <span className="text-brand-100/60">
              Booking Expiry
            </span>

            <span className="text-brand-100">
              3h 20m
            </span>
          </div>

          <div
            className="
            h-2
            rounded-full
            bg-white/10
            overflow-hidden
            mt-2
          "
          >
            <div
              className={`
              h-full
              ${style.progress}
            `}
              style={{
                width: "25%",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div
          className="
          border-t border-white/5
          mt-5
          pt-4
        "
        >
          {cta}
        </div>
      </div>
    </section>
  );
};

export default BookingCard;