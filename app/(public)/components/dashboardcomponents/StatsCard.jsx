import React from "react";
import { HiOutlineArrowUp } from "react-icons/hi2";
import { motion } from "framer-motion";

const StatsCard = ({ card }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      key={card.id}
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{card.title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {card.value}
          </h3>
          <div className="flex items-center mt-2">
            <HiOutlineArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">
              {card.change}
            </span>
            <span className="text-gray-400 text-xs ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-4 ${card.bgLight} rounded-xl`}>
          <card.icon className={`w-6 h-6 ${card.iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
