import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Listings", path: "/admin/listings" },
    { name: "Disputes", path: "/admin/disputes" },
  ];
  
  return (
    <div className="bg-brand-900 border-b border-accent-500 p-4 lg:hidden flex justify-between items-center">
      <h2 className="playfair text-xl">Admin Dashboard</h2>

      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="bg-accent-500 rounded-lg text-brand-900 px-4 py-2  source-code-pro"
      >
        <Menu />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }} // 👈 exit animation
            transition={{ duration: 0.3 }}
            className="bg-brand-900 flex flex-col items-center justify-center gap-4 absolute z-20 top-0 left-0 right-0 bottom-0"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 active:scale-95 right-4 bg-red-500 rounded-full p-2"
            >
              <X height={30} width={30} />
            </button>
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block p-2 rounded text-2xl montserrat transition ${
                    isActive ? " underline" : "hover:bg-brand-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
