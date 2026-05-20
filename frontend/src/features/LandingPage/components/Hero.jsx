import { ArrowRight, MessageCircle, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

/* ================= CTA ================= */
function CTA() {
  return (
    <div className="flex flex-col items-center source-code-pro justify-center xl:justify-start sm:flex-row gap-3 sm:gap-4 mt-6 ">
      <Link
        to={"/register"}
        className="w-full text-brand-900 source-code-pro font-bold text-xl sm:w-2/3 px-6 sm:px-8 py-3 sm:py-4 bg-accent-500 hover:bg-accent-400 active:bg-accent-300 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        Start Swapping <ArrowRight size={18} />
      </Link>

      <a
        href="#how"
        className="w-full whitespace-nowrap sm:w-1/3 px-6 py-3 sm:py-4 border border-white/10 rounded-xl text-brand-100 hover:bg-white/5 transition-colors"
      >
        See How It Works
      </a>
    </div>
  );
}





/* ================= VISUAL ================= */
function HeroVisual({ parallaxX, parallaxY }) {
  return (
    <motion.div
      style={{ x: parallaxX, y: parallaxY }}
      className="relative hidden md:flex flex-col h-full items-center justify-center"
    >

    </motion.div>
  );
}

/* ================= TEXT ================= */
function HeroText() {
  return (
    <div className="text-center xl:text-left z-1">

      <h1 className="text-4xl -tracking-normal  playfair sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-tight">
        Swap Smarter.
        <br />
        Trade What <span className="text-accent-500">You Have</span>
        <br />
        for What You Need.
      </h1>

      <p className="text-xs montserrat sm:text-sm md:text-lg text-brand-200 mt-4 sm:mt-6 max-w-md sm:max-w-lg mx-auto xl:mx-0">
        List items, find matches, negotiate in real-time, and swap securely —
        all in one place.
      </p>

      <CTA />

      <div className="flex flex-wrap montserrat justify-center xl:justify-start gap-3 sm:gap-6 mt-6 text-xs sm:text-sm text-brand-200">
        <span>✔ Real-time negotiation</span>
        <span>✔ Built-in chat</span>
        <span>✔ Secure swaps</span>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <section
      className="relative px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-16 sm:pb-20  overflow-hidden min-h-screen flex items-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-brand-100 -z-10" />
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] bg-brand-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16 items-center">
        <HeroText />
        <HeroVisual parallaxX={mouse.x * 14} parallaxY={mouse.y * 10} />
      </div>
    </section>
  );
}
