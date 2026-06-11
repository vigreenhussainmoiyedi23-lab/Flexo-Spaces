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
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-0 right-0 z-40 px-4"
        >
          <div className="max-w-4xl mx-auto rounded-2xl bg-text-primary shadow-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-white playfair text-lg font-semibold">
                  Ready to power your next big idea?
                </p>

                <p className="text-brand-100 text-sm montserrat mt-1">
                  Find, compare, and book workspaces designed for productivity
                  and growth.
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <Link
                  to="/spaces"
                  className="px-5 py-3 rounded-xl text-white bg-brand-200 hover:bg-accent-400 active:bg-accent-300 text-brand-900 font-semibold transition-colors"
                >
                  Find Spaces
                </Link>

                <Link
                  to="/register/workspace_owner"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-text-primary font-semibold transition-colors"
                >
                  List Your Space
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