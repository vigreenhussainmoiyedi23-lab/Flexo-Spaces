import { Shield, MessageCircle, Search, Zap, Lock, Brain } from "lucide-react";
import { motion } from "framer-motion";

const SystemFeatures = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Authentication",
      desc: "JWT + Google OAuth + Redis session management"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Real-time Chat",
      desc: "Socket.IO messaging with room-based architecture"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      desc: "Geographic filtering + advanced search options"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Valuation",
      desc: "Google Gemini integration for fair pricing"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Complete Swap System",
      desc: "Full lifecycle: request → accept → complete"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Enterprise Security",
      desc: "Input validation + rate limiting + helmet.js"
    }
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
              className="bg-brand-800 border border-white/10 hover:border-accent-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 w-full"
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 bg-accent-500/15 rounded-xl flex items-center justify-center">
                <div className="text-accent-500">
                  {feature.icon}
                </div>
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
