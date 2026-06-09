import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-text-primary text-white border-t border-brand-100/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-brand-100">
              Flexo Spaces
            </h2>

            <p className="text-brand-100/70 text-sm mt-4 leading-relaxed max-w-md">
              Discover, compare, and book modern coworking spaces, private
              offices, meeting rooms, and flexible workspaces tailored to your
              team's needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-brand-100 mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-sm text-brand-100/70">
              <Link
                to="/spaces"
                className="hover:text-white transition-colors"
              >
                Browse Spaces
              </Link>

              <Link
                to="/createSpace"
                className="hover:text-white transition-colors"
              >
                List Your Space
              </Link>

              <Link
                to="/bookings"
                className="hover:text-white transition-colors"
              >
                My Bookings
              </Link>

              <Link
                to="/dashboard"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-semibold text-brand-100 mb-4">
              Get Started
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/spaces"
                className="px-4 py-2 bg-brand-100 text-text-primary font-medium rounded-lg text-center hover:opacity-90 transition"
              >
                Find a Workspace
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 border border-brand-100/20 rounded-lg text-center hover:bg-brand-100/10 transition"
              >
                Join Flexo
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-brand-100/10 my-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-brand-100/60">
          <p>
            © {new Date().getFullYear()} Flexo Spaces. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Work smarter • Discover better spaces • Grow together 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;