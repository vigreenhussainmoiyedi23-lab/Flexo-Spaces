import { Link } from "react-router-dom";

const FooterCTA = () => {
  return (
    <div className="w-full bg-brand-900 px-4 py-16">

      {/* Card */}
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-10 md:p-14 shadow-lg shadow-black/30">

        {/* subtle glow background */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-500/20 blur-3xl rounded-full" />

        {/* Content */}
        <div className="relative text-center">

          {/* Trust badge */}
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">
            Sustainable Fashion Marketplace
          </p>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl font-semibold text-white leading-snug">
            Don’t let unused clothes sit idle —
            <br />
            turn them into swaps, value, and new styles
          </h2>

          {/* Subtext */}
          <p className="text-brand-200 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Every listing on SwapStyle helps reduce waste and gives your wardrobe a second life.
            Join users already swapping instead of buying new.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-brand-200">
            <div>
              <p className="text-white text-lg font-semibold">Secure swaps</p>
              <p className="text-brand-300">End-to-end workflow</p>
            </div>
            <div>
              <p className="text-white text-lg font-semibold">Real-time chat</p>
              <p className="text-brand-300">Negotiate instantly</p>
            </div>
            <div>
              <p className="text-white text-lg font-semibold">Smarter listings</p>
              <p className="text-brand-300">AI valuation support</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

            <Link
              to="/listings"
              className="px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 active:bg-accent-300 text-brand-900 font-semibold transition-colors shadow-lg shadow-black/30"
            >
              Start Swapping
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 rounded-xl border border-white/15 text-white font-medium hover:bg-white/10 transition"
            >
              Create Account
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default FooterCTA;