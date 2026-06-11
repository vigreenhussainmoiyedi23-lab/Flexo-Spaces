import { Shield, Search, BarChart3, CalendarCheck, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SystemFeatures = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Workspace Discovery",
      desc: "Find spaces based on location, budget, capacity, and amenities.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Recommendations",
      desc: "Get workspace suggestions tailored to your requirements.",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Verified Workspaces",
      desc: "Explore detailed listings with photos and facility information.",
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Seamless Booking",
      desc: "Reserve workspaces quickly with a smooth booking experience.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Owner Dashboard",
      desc: "Track bookings, manage listings, and monitor workspace performance.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      desc: "Protected accounts, reliable bookings, and trusted interactions.",
    },
  ];

  return (
    <section className="py-20 bg-brand-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl playfair md:text-5xl font-semibold mb-4">
            System Features
          </h2>
          <p className="text-brand-200 montserrat text-sm">
            Production-ready MERN stack with comprehensive functionality
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-text-secondary border border-white/10 hover:border-accent-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 w-full"
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 bg-accent-500/15 rounded-xl flex items-center justify-center">
                <div className="text-white">{feature.icon}</div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold playfair text-white mb-3 text-center">
                {feature.title}
              </h3>

              <p className="text-brand-200 montserrat text-sm leading-relaxed text-center">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemFeatures;
