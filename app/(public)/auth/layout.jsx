"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-200/95 flex items-center justify-center">
      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
       

        {/* Page content */}
        <AnimatePresence>{children}</AnimatePresence>

       
        
      </motion.div>
    </div>
  );
}
