 "use client";

import { motion } from "framer-motion";
import { 
  Home, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Calendar,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

const ListPropertySection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      id: 1,
      icon: <DollarSign className="w-8 h-8" />,
      title: "Maximize Your Earnings",
      description: "Earn up to 30% more compared to traditional rentals",
      stats: "Avg. 92% occupancy rate",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      icon: <Shield className="w-8 h-8" />,
      title: "Fully Insured & Protected",
      description: "$1M property damage protection & guest verification",
      stats: "24/7 Support",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Management",
      description: "Choose your own availability, pricing, and house rules",
      stats: "Smart Pricing Tool",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 4,
      icon: <Users className="w-8 h-8" />,
      title: "Reach Millions of Guests",
      description: "Join our community of 2M+ verified travelers worldwide",
      stats: "Global Network",
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50"
    }
  ];

  const steps = [
    { number: "01", title: "Create Your Listing", description: "Add photos, details, and set your pricing" },
    { number: "02", title: "Get Verified", description: "Complete our quick verification process" },
    { number: "03", title: "Start Earning", description: "Welcome your first guests in days" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
          <Home className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600 font-semibold">For Property Owners</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Turn Your Property Into{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Passive Income
          </span>
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of property owners earning extra income while providing amazing stays to travelers worldwide.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Benefits Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              variants={fadeInUp}
              onMouseEnter={() => setHoveredCard(benefit.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group ${benefit.bgColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl" />
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} mb-4`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-3">
                  {benefit.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {benefit.stats}
                  </span>
                </div>

                {/* Animated border effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  initial={false}
                  animate={{ scale: hoveredCard === benefit.id ? 1.05 : 1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column - Steps & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* How It Works */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How It Works
            </h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">{step.number}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto mt-2 group-hover:translate-x-2 transition-transform" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                $2.5K+
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg. Monthly Earnings</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-sm text-gray-600 mt-1">Owner Satisfaction</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                24h
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg. First Booking</div>
            </div>
          </div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Earning?
              </h3>
              
              <ul className="space-y-3 mb-6">
                {[
                  "No listing fees - only pay when you get booked",
                  "Professional photography service available",
                  "Free cancellation for owners",
                  "Weekly payouts to your bank account"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-xl transition-shadow"
                >
                  List Your Property Now
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Schedule a Call
                </motion.button>
              </div>
              
              <p className="text-sm text-blue-100 mt-4">
                First month commission-free for new owners 🎉
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ListPropertySection;