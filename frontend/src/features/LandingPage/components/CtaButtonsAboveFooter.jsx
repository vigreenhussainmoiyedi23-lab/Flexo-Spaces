import { Link } from "react-router-dom";

const FooterCTA = () => {
  return (
    <div className="w-full  px-4 py-16">
      <div className="max-w-5xl bg-text-primary mx-auto overflow-hidden rounded-xl border border-white/10  p-10 md:p-14 shadow-lg shadow-black/30">
        <div className="text-center ">
          {/* Trust badge */}
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">
            Smart Workspace Discovery Platform
          </p>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl font-semibold text-white leading-snug">
            Find the workspace that
            <br />
            powers your next big idea
          </h2>

          {/* Subtext */}
          <p className="text-brand-100 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Discover flexible workspaces, private offices, and collaborative
            environments designed for productivity. Whether you're a freelancer,
            startup, or growing team, Flexo Spaces helps you find the perfect
            place to work.
          </p>

          {/* Stats row */}
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8 text-sm">
            <div>
              <p className="text-white text-lg font-semibold">
                Smart Matching
              </p>
              <p className="text-brand-300">
                Personalized recommendations
              </p>
            </div>

            <div>
              <p className="text-white text-lg font-semibold">
                Verified Spaces
              </p>
              <p className="text-brand-300">
                Detailed workspace listings
              </p>
            </div>

            <div>
              <p className="text-white text-lg font-semibold">
                Easy Booking
              </p>
              <p className="text-brand-300">
                Reserve in just a few clicks
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/spaces"
              className="px-6 py-3 rounded-xl bg-brand-200 hover:bg-brand-200/90 active:scale-98 text-brand-900 font-semibold transition-colors shadow-lg shadow-black/30"
            >
              Explore Spaces
            </Link>

            <Link
              to="/register/workspace_owner"
              className="px-6 py-3 rounded-xl border border-white/15 text-white font-medium hover:bg-white/10 transition"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCTA;