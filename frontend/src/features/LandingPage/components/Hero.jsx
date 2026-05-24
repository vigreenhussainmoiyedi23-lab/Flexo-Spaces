import { ArrowRight, MessageCircle, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BlurImage from "../../commonComponents/BlurImages";
/* ================= CTA ================= */
function CTA() {
  return (
    <div className="flex flex-col items-center source-code-pro justify-center xl:justify-start sm:flex-row gap-3 sm:gap-4 mt-6 ">
      <Link
        to={"/register/user"}
        className="w-full text-brand-100 exo-2 font-bold text-xl sm:w-2/3 px-6 sm:px-8 py-3 sm:py-4 bg-accent-400 hover:bg-accent-400 active:bg-accent-300 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        Find Spaces <ArrowRight size={18} />
      </Link>
      <Link
        to={"/register/workspace_owner"}
        className="w-full text-accent-300 exo-2 font-bold text-xl sm:w-2/3 px-6 sm:px-8 py-3 sm:py-4 bg-brand-200 hover:bg-brand-500/90 active:bg-brand-200 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        List Your Spaces <ArrowRight size={18} />
      </Link>
    </div>
  );
}

/* ================= VISUAL ================= */
function HeroVisual({ parallaxX, parallaxY }) {
  const ImagesUrl = [
    {
      url: "/WORKSPACES/office1.jpg",
      compressedUrl: "/WORKSPACES/compressed/office1.jpg",
    },
    {
      url: "/WORKSPACES/office2.jpg",
      compressedUrl: "/WORKSPACES/compressed/office2.jpg",
    },
    {
      url: "/WORKSPACES/office3.jpg",
      compressedUrl: "/WORKSPACES/compressed/office3.jpg",
    },
    {
      url: "/WORKSPACES/office4.jpg",
      compressedUrl: "/WORKSPACES/compressed/office4.jpg",
    },
  ];
  return (
    <motion.div
      style={{ x: parallaxX, y: parallaxY }}
      className="relative hidden  md:flex flex-col h-full items-center justify-center"
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        className="w-full h-full"
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {ImagesUrl.map((image) => (
          <SwiperSlide className="w-full h-full">
            <BlurImage
              alt={"officeImage"}
              highQualitySrc={image.url}
              lowQualitySrc={image.compressedUrl}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}

/* ================= TEXT ================= */
function HeroText() {
  return (
    <div className="text-center xl:text-left z-1">
      <h1 className="text-4xl text-text-primary shanti  tracking-normal playfair sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-tight">
        Spaces That
        <br />
        Power <span className="text-gray-800 underline">Modern Work</span>
        <br />
        and Big Ideas.
      </h1>

      <p className="text-xs exo-2 sm:text-sm md:text-lg text-text-muted mt-4 sm:mt-6 max-w-md sm:max-w-lg mx-auto xl:mx-0">
        Discover, list, and manage modern workspaces with real-time
        availability, smart search, and seamless booking — all in one place.
      </p>

      <CTA />

      <div className="flex flex-wrap exo-2 justify-center xl:justify-start gap-3 sm:gap-6 mt-6 text-xs sm:text-sm text-brand-200">
        <span>✔ Real-time negotiation</span>
        <span>✔ Built-in chat</span>
        <span>✔ Secure Bookings</span>
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
