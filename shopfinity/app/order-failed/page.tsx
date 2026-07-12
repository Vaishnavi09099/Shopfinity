"use client";

import { motion } from "framer-motion";
import { FaTimesCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl shadow-red-200/50 rounded-3xl p-10 max-w-md w-full text-center"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Failed Icon with pulsing ring */}
        <div className="relative z-10 flex justify-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: 0.35 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-orange-500 blur-md"
          />

          <motion.div
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center ring-8 ring-white shadow-lg shadow-red-200"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <FaTimesCircle className="text-white" size={52} />
            </motion.div>
          </motion.div>
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 inline-flex items-center gap-1.5 mt-6 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold"
        >
          ⚠️ Payment Unsuccessful
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="relative z-10 text-2xl sm:text-3xl font-extrabold mt-3"
        >
          <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
            Payment Failed
          </span>
        </motion.h1>

        {/* Sub Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 mt-5"
        >
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Something went wrong and your payment could not be processed.
          </p>
          <p className="text-xs text-gray-400 mt-1.5">
            Please try again or choose another payment method.
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
            onClick={() => router.push("/cart")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-sm shadow-md shadow-red-200 hover:opacity-90 transition"
          >
            <FaShoppingCart size={14} /> Try Again from Cart
          </motion.button>

          <button
            onClick={() => router.push("/orders")}
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Go to Orders Page
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            <FaHome size={13} /> Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}