import {
  Briefcase,
  Building2,
  CalendarCheck,
  Handshake,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Tag,
  UserPlus,
} from "lucide-react";
import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
const HowItWorks = () => {
  const { scrollYProgress } = useScroll();
  const lineScale = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const steps = [
    {
      title: "Create Your Account",
      desc: "Sign up and set up your profile in minutes.",
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      title: "Search Workspaces",
      desc: "Browse co-working spaces based on location, budget, and amenities.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Find Your Perfect Match",
      desc: "Use smart recommendations to discover spaces that fit your needs.",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "View Space Details",
      desc: "Explore photos, facilities, pricing, and workspace information.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      title: "Book Your Workspace",
      desc: "Reserve your preferred space quickly and securely.",
      icon: <CalendarCheck className="w-6 h-6" />,
    },
    {
      title: "Start Working",
      desc: "Check in and enjoy a productive work environment.",
      icon: <Briefcase className="w-6 h-6" />,
    },
  ];

  return (
    <section id="how" className="py-24 bg-brand-100 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl playfair md:text-5xl font-semibold mb-4">
            How It Works
          </h2>
          <p className="text-brand-200 montserrat text-sm">
            From listing to swapping — simple, clear, and secure
          </p>
        </div>

        {/* Timeline line (base) */}
        <div className="absolute lg:left-1/2 left-2 top-44 bottom-20 w-0.5 bg-white/10 lg:block" />
        {/* Timeline line (progress) */}
        <motion.div
          style={{ scaleY: lineScale, transformOrigin: "top" }}
          className="absolute lg:left-1/2 left-2 top-44 bottom-20 w-0.5 bg-text-primary lg:block"
        />

        {/* Steps */}
        <div className="space-y-10 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`flex flex-col relative lg:flex-row items-center gap-8 ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex-1 w-full max-w-xl bg-text-primary border border-white/10 hover:border-accent-500/40 rounded-xl p-8 shadow-sm shadow-black/20"
              >
                <div className="flex items-center source-code-pro gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-500/15 text-white">
                    {step.icon}
                  </div>

                  <span className="text-sm text-brand-500 font-semibold">
                    STEP {i + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold playfair tracking-wide mb-2 text-white">
                  {step.title}
                </h3>

                <p className="text-brand-200 montserrat leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>

              {/* Connector Dot */}
              <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-accent-500/15 border border-accent-500/30 z-10">
                <div className="w-3 h-3 bg-accent-500 rounded-full" />
              </div>
              <div className="absolute lg:hidden md:scale-75 scale-50 -translate-y-1/2 top-1/2 -left-8.5 flex items-center justify-center w-10 h-10 rounded-full bg-accent-500/15 border border-accent-500/30 z-10">
                <div className="w-3 h-3 bg-accent-500 rounded-full" />
              </div>
              {/* Spacer */}
              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
