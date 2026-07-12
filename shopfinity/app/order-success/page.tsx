"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaBox, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl shadow-purple-200/50 rounded-3xl p-10 max-w-md w-full text-center"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Confetti dots */}
        {[
          { top: "8%", left: "12%", color: "bg-orange-400", delay: 0.3 },
          { top: "14%", left: "82%", color: "bg-purple-500", delay: 0.4 },
          { top: "30%", left: "6%", color: "bg-pink-400", delay: 0.5 },
          { top: "22%", left: "90%", color: "bg-purple-300", delay: 0.6 },
          { top: "4%", left: "50%", color: "bg-pink-500", delay: 0.35 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -10, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-10, 10, 20], scale: [0, 1, 1, 0.8] }}
            transition={{ duration: 1.6, delay: dot.delay, ease: "easeOut" }}
            className={`absolute w-2 h-2 rounded-full ${dot.color} pointer-events-none`}
            style={{ top: dot.top, left: dot.left }}
          />
        ))}

        {/* Success Icon with pulsing ring */}
        <div className="relative z-10 flex justify-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: 0.4 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 blur-md"
          />

          <motion.div
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center ring-8 ring-white shadow-lg shadow-purple-200"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle className="text-white" size={52} />
            </motion.div>
          </motion.div>
        </div>

     

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="relative z-10 text-2xl sm:text-3xl font-extrabold mt-10"
        >
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Order Placed Successfully
          </span>
        </motion.h1>

        {/* Sub Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-3 mt-5"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center">
            <FaBox size={18} className="text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Your order has been received and is now being processed. We'll notify you once it's on the way.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 mt-8 space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/orders")}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:opacity-90 transition"
          >
            Go to Orders Page
          </motion.button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            <FaHome size={13} /> Continue Shopping
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}