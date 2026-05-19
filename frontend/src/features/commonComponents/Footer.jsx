import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a140f] border-t border-white/10 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-white">SwapStyle</h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              A sustainable fashion marketplace where users swap clothes, save
              money, and reduce waste.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link to="/listings" className="hover:text-white transition">
                Browse Listings
              </Link>
              <Link to="/createListing" className="hover:text-white transition">
                Create Listing
              </Link>
              <Link to="/swaps" className="hover:text-white transition">
                My Swaps
              </Link>
              <Link to="/chats" className="hover:text-white transition">
                Messages
              </Link>
            </div>
          </div>

          {/* Auth / CTA */}
          <div>
            <h3 className="text-white font-medium mb-3">Get Started</h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg text-center transition"
              >
                Join Now
              </Link>

              <Link
                to="/listings"
                className="px-4 py-2 border border-white/20 text-white text-sm rounded-lg text-center hover:bg-white/10 transition"
              >
                Explore Listings
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 my-8"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} SwapStyle. All rights reserved.</p>

          <p className="text-center md:text-right">
            Swap clothes • Save money • Save the planet 🌿
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
