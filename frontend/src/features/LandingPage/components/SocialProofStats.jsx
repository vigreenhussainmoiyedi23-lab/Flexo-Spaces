import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useAdmin from "../../admin/hooks/useAdmin";

const Stat = ({ label, value, hint }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-xl bg-brand-800 border border-white/10 hover:border-accent-500/30 p-6 shadow-lg shadow-black/30"
    >
      <p className="text-brand-200 text-sm montserrat">{label}</p>
      <p className="text-white playfair text-3xl font-semibold mt-2">{value}</p>
      {hint && <p className="text-brand-300 text-xs mt-2">{hint}</p>}
    </motion.div>
  );
};

const SocialProofStats = () => {
  const { GetPlatformAnalyticsHandler, analyticsTotal } = useAdmin();
  useEffect(() => {
    GetPlatformAnalyticsHandler();
  }, []);
  return (
    <section className="bg-brand-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-lg shadow-black/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl playfair font-semibold text-white">
                Built for real swaps, not hype
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500/15 border border-accent-500/25">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-500" />
              <span className="text-accent-500 text-sm font-semibold">
                Live platform
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Stat
              label="Swaps completed"
              value={analyticsTotal?.swaps || 0}
              hint="Measured from your swap lifecycle"
            />
            <Stat
              label="Active users"
              value={analyticsTotal?.users || 0}
              hint="Based on real logins & sessions"
            />
            <Stat
              label="Listings added"
              value={analyticsTotal?.listings || 0}
              hint="Pulled from listing creation events"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofStats;
