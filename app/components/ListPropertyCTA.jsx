"use client";

import { motion } from "framer-motion";
import { FaHome, FaKey, FaChartLine, FaCheckCircle } from "react-icons/fa";

export default function ListPropertyCTA() {
  return (
    <section className="max-w-8xl relative py-24 overflow-hidden bg-white">
      {/* Decorative blur */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary-accent text-white text-sm font-semibold">
            For Property Owners & Agents
          </span>

          <h2 className="text-4xl  md:text-6xl font-stretch-extra-condensed text-primary leading-tight mb-7">
            Turn Your Property Into <br className="hidden sm:block" />
            <span className="text-primary-accent">Income.</span> List It With Us.
          </h2>

          <p className="text-lg max-w-[70%] mb-10">
            Whether you’re selling, renting, or offering shortlet stays, we help
            you reach real clients faster, manage your listings easily, and
            showcase your property professionally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-5 rounded-full bg-primary text-white font-bold hover:bg-primary-accent transition-all shadow-lg">
              List Your Property
            </button>
            
          </div>
        </motion.div>

        {/* RIGHT FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 "
        >
          {[
            {
              icon: <FaHome />,
              title: "Showcase Your Property",
              desc: "Professional listings that attract serious buyers, renters, and shortlet guests.",
            },
            {
              icon: <FaKey />,
              title: "Flexible Listing Types",
              desc: "Sell, rent, or host short stays — all from one powerful platform.",
            },
            {
              icon: <FaChartLine />,
              title: "Reach More Clients",
              desc: "Your properties get discovered by users actively searching.",
            },
            {
              icon: <FaCheckCircle />,
              title: "Verified & Trusted",
              desc: "We build credibility around your listings to increase conversions.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-accent text-white flex items-center justify-center text-xl mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
