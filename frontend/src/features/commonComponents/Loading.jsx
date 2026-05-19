import React from "react";
import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-brand-900 z-50">
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        {/* Replace with your logo */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-500)] flex items-center justify-center text-white text-xl font-bold">
         <img className="rounded-full" src="/svg/panel.png" alt="logo" />
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-sm text-gray-500 tracking-wide"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loader;