"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Store,
 
  MapPin,
  FileText,

  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";



const VendorShopDetails = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [shopAddress, setshopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName || !shopAddress || !gstNumber) {
      alert("Please fill all vendor details");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/vendor/update-details", {
        shopName,
        shopAddress,
        gstNumber,
      });
      console.log(result.data)
      alert("Vendor Shop Details added Successfully")
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200 flex flex-col">
      {/* Blobs */}
      <div className="absolute w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/3 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-0 left-1/4 pointer-events-none" />

      {/* Navbar */}
      <div className="flex items-center justify-between px-10 md:px-20 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <img className="w-7 h-6" src="./favicon.ico" alt="logo" />
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Shopfinity
          </span>
        </div>
        <button type="button" className="text-gray-700 font-medium">
          Cancel
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center px-4 mt-2">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide bg-white/70 backdrop-blur px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          VENDOR ONBOARDING
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          Complete your{" "}
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            shop details
          </span>
        </h1>
        <p className="text-gray-500 max-w-lg">
          Enter your business information to activate your vendor account.
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            <StepDone label="Role" />
            <StepLine />
            <StepDone label="Mobile" />
            <StepLine />
            <StepActive number={3} label="Shop Details" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop / Business name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
                <Store className="w-3.5 h-3.5" /> SHOP / BUSINESS NAME <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
               value={shopName}
              onChange={(e) => setShopName(e.target.value)}

                placeholder="e.g. Trendy Threads"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
              />
            </div>

          
          

            {/* Business address */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
                <MapPin className="w-3.5 h-3.5" /> BUSINESS ADDRESS <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"

                value={shopAddress}
              onChange={(e) => setshopAddress(e.target.value)}

                placeholder="Shop address, city, state, pincode"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
              />
            </div>

            {/* GST / Tax ID */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide mb-1">
                <FileText className="w-3.5 h-3.5" /> GST Number
              </label>
              <input
                type="text"
               value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}

                placeholder="Optional registration number"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
              />
            </div>

        

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white text-sm font-semibold py-3 rounded-2xl disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Details"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>

            <p className="text-center text-xs text-gray-400">
              By submitting, you agree to our vendor terms and verification policy.
            </p>
          </form>
        </motion.div>
      </div>

      {/* Floating animated bag bottom-right */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 right-6 opacity-20 pointer-events-none"
      >
        <img className="w-40 h-40" src="./favicon.ico" alt="bag" />
      </motion.div>
    </div>
  );
};

/* ---------- Step indicator sub-components ---------- */

const StepDone = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      <Check className="w-4 h-4 text-white" strokeWidth={3} />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

const StepActive = ({ number, label }: { number: number; label: string }) => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-9 h-9 rounded-full border-2 border-pink-500 flex items-center justify-center text-pink-600 text-sm font-bold">
      {number}
    </div>
    <span className="text-sm font-semibold text-pink-600">{label}</span>
  </div>
);

const StepLine = () => (
  <div className="flex-1 h-[2px] bg-gradient-to-r from-orange-400 to-purple-500 min-w-[40px]" />
);

export default VendorShopDetails;