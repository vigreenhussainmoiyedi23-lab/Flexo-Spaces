import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";

const BookingCard = ({ booking, cta, urgency = "normal" }) => {
  const space = booking.space;
  const [hours, setHours] = useState(
    Math.floor((Date.parse(booking.expiresAt) - Date.now()) / (1000 * 60 * 60)),
  );
  const [minutes, setMinutes] = useState(
    Math.floor((Date.parse(booking.expiresAt) - Date.now()) / (1000 * 60)) -
      hours * 60,
  );
  const [seconds, setSeconds] = useState(
    Math.floor((Date.parse(booking.expiresAt) - Date.now()) / 1000) -
      hours * 60 * 60 -
      minutes * 60,
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;

        setMinutes((m) => {
          if (m > 0) return m - 1;

          setHours((h) => Math.max(0, h - 1));
          return 59;
        });

        return 59;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const urgencyStyles = {
    normal: {
      shadow: "",
      badge: "bg-accent-500",
      progress: "bg-brand-500",
    },

    warning: {
      shadow: "shadow-[0_0_25px_rgba(224,177,78,0.35)]",
      badge: "bg-brand-200",
      progress: "bg-orange-200",
    },

    critical: {
      shadow: "shadow-[0_0_35px_rgba(155,44,78,0.45)]",
      badge: "bg-error",
      progress: "bg-orange-500",
    },

    danger: {
      shadow: "shadow-[0_0_45px_rgba(155,44,78,0.7)] animate-pulse",
      badge: "bg-error",
      progress: "bg-red-500",
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
        {booking.status === "pending" && (
          <span
            className={`
          absolute
          right-3
          top-3
          px-3
          py-1
          rounded-sm
          text-sm
          font-bold
          text-white
          flex flex-col items-center
          bg-text-primary
        `}
          >
            <span>
              {hours * 60 * 60 + minutes * 60 + seconds > 0 &&
                hours + ":" + minutes + ":" + seconds}
            </span>
            <span className="text-[8px] self-start ">
              {hours * 60 * 60 + minutes * 60 + seconds <= 0
                ? "expired"
                : "expires in "}
            </span>
          </span>
        )}
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
            {new Date(booking.fromDateTime).toLocaleDateString()}
            <span className="mx-1">→</span>
            {new Date(booking.endDateTime).toLocaleDateString()}
          </span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div
            className="
            bg-white/5
            rounded-2xl
            p-3
          "
          >
            <p className="text-brand-100/50 text-xs">Seats</p>

            <p className="text-brand-100 font-bold">
              {booking.seatsBooked}/{booking.totalCapacitySnapshot}
            </p>
          </div>

          <div
            className="
            bg-white/5
            rounded-2xl
            p-3
          "
          >
            <p className="text-brand-100/50 text-xs">Amount</p>

            <p className="text-brand-100 font-bold">
              ₹{booking.pricing.finalPrice}
            </p>
          </div>
        </div>
        {/* Owner And Booked By */}
        <div className="flex items-center justify-around">
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
          {/* {Booked By} */}
          <div
            className="
          mt-5
          flex
          items-center
          gap-3
          "
          >
            <div>
              <p
                className="
                text-brand-100/50
                text-xs
                "
              >
                booked By
              </p>

              <p
                className="
                text-brand-100
                text-sm
                font-semibold
                "
              >
                {booking.bookedBy.username}
              </p>
            </div>
            <img
              src={booking.bookedBy.profilePicture}
              alt={booking.bookedBy.username}
              className="
                w-10
                h-10
                rounded-full
                object-cover
                "
            />
          </div>
        </div>

        {/* URGENCY */}
        {["pending", "expired"].includes(booking.status) && (
          <div className="mt-5">
            <div className="flex justify-between text-xs">
              {booking.status !== "expired" && (
                <>
                  <span className="text-brand-100/60">Booking Expiry</span>

                  <span className="text-brand-100">
                    {hours}h {minutes}m
                  </span>
                </>
              )}
              {booking.status === "expired" && (
                <span className="text-brand-100/60">Booking Expired</span>
              )}
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
                ${
                  urgencyStyles[
                    hours <= 6
                      ? "danger"
                      : hours <= 12
                        ? "critical"
                        : hours <= 18
                          ? "warning"
                          : "normal"
                  ].progress
                }`}
                style={{
                  width:
                    Math.max(
                      0,
                      Math.min(100, ((hours * 60 + minutes) / (24 * 60)) * 100),
                    ) + "%",
                }}
              />
            </div>
            {["pending", "expired"].includes(booking.status) && (
              <span className="text-xs whitespace-nowrap text-white/50">
                our system expires booking automatically after 24 hours of
                inacitivity
              </span>
            )}
          </div>
        )}

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
