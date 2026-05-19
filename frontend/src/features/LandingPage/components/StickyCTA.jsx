import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const StickyCTA = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShow(false);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-0 right-0 z-40 px-4"
        >
          <div className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-brand-800/80 backdrop-blur-xl shadow-lg shadow-black/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-white playfair text-lg font-semibold">
                  Ready to swap something today?
                </p>
                <p className="text-brand-200 text-sm montserrat">
                  Browse listings or create your first one now it takes a minute.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/listings"
                  className="px-5 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 active:bg-accent-300 text-brand-900 font-semibold transition-colors"
                >
                  Browse
                </Link>
                <Link
                  to="/createListing"
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-brand-100 font-semibold transition-colors"
                >
                  Create listing
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
