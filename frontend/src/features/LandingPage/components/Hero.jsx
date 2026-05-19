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

/* ================= STEP ================= */
function Step({ title, desc, icon, path }) {
  return (
    <>
      <Link
        to={path}
        className="flex items-center gap-3  bg-sec2/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-center min-w-[100px]"
      >
        {icon}
        <div className="text-start">
          <h4 className="text-xs playfair sm:text-sm text-brand-100 font-medium">
            {title}
          </h4>
          <p className="text-[10px] montserrat sm:text-xs text-brand-200">
            {desc}
          </p>
        </div>
      </Link>
    </>
  );
}

// ================= PRODUCT =================

function ProductCard() {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-44 xl:w-56 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl"
    >
      <img
        loading="lazy"
        alt="Denim Jacket"
        src="/Hero/denimJacket.webp"
        className="rounded-xl mb-2 sm:mb-3"
      />
      <h3 className="text-white playfair text-sm sm:text-base font-semibold">
        Denim Jacket
      </h3>
      <p className="text-xs montserrat sm:text-sm text-brand-200">
        Size M • Like New
      </p>
    </motion.div>
  );
}

/* ================= CHAT ================= */
function ChatCard() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-44 sm:w-56 md:w-64 font-light montserrat bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl"
    >
      <p className="text-xs sm:text-sm py-2 bg-brand-500 text-tri mb-2 bg-sec w-fit rounded-r-full rounded-t-full px-3">
        Love your jacket 👀
      </p>
      <p className="text-xs sm:text-sm py-2 mb-3 bg-sec w-fit rounded-r-full rounded-t-full px-3 bg-brand-500">
        T-shirt + ₹500?
      </p>
      <div className="bg-brand-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-t-full rounded-l-full border border-white/10 w-fit ml-auto">
        Deal 🤝
      </div>
    </motion.div>
  );
}

/* ================= SWAP ================= */
function SwapCard() {
  return (
    <motion.div
      initial={{ scale: 0.8, y: 0, opacity: 0 }}
      animate={{ scale: 1, y: -30, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex items-center w-60 h-30 gap-3 sm:gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl"
    >
      <img
        loading="lazy"
        alt="Denim Jacket"
        src="/productImages/ryan-hoffman-6Nub980bI3I-unsplash.jpg"
        className="w-14 h-14 sm:h-25 object-center object-cover sm:w-20 rounded-lg"
      />
      <span className="text-accent-500 text-lg sm:text-2xl">⇄</span>
      <img
        loading="lazy"
        alt="Denim Jacket"
        src="/Hero/denimJacket.webp"
        className="w-14 h-14 sm:h-25 object-center object-cover sm:w-20 rounded-lg"
      />
    </motion.div>
  );
}

/* ================= VISUAL ================= */
function HeroVisual({ parallaxX, parallaxY }) {
  return (
    <motion.div
      style={{ x: parallaxX, y: parallaxY }}
      className="relative hidden md:flex flex-col items-center justify-center"
    >
      {/* Glow */}
      <div className="absolute w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-accent-500/15 blur-[120px] rounded-full" />

      <div className="flex items-center justify-center gap-4 shrink-0 flex-nowrap">
        {/* Floating Cards */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="  rotate-[-4deg]"
        >
          <ChatCard />
        </motion.div>

        <SwapCard />

        <motion.div
          animate={{ y: [40, 30, 40] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="  rotate-[4deg]"
        >
          <ProductCard />
        </motion.div>
      </div>
      {/* Steps */}
      <div className="flex items-center justify-center xl:justify-start gap-3 sm:gap-4 mt-10">
        <Step
          path={"/createListing"}
          title="List Items"
          desc="Add what you want"
          icon={<Plus className="text-brand-100" />}
        />
        <Step
          path={"/listings"}
          title="Find Matches"
          desc="Discover items"
          icon={<Search className="text-brand-100" />}
        />
        <Step
          path={"/chat"}
          title="Negotiate"
          desc="Chat & agree"
          icon={<MessageCircle className="text-brand-100" />}
        />
      </div>
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
      className="relative px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden min-h-screen flex items-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-brand-900 -z-10" />
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
