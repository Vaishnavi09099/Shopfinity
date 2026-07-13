"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";


export default function ProductsPageForUserInterface() {
  const { allProductData } = useSelector((state: RootState) => state.vendor);

  // ✅ ONLY ACTIVE + APPROVED PRODUCTS
  const visibleProducts = useMemo(() => {
    if (!Array.isArray(allProductData)) return [];
    return allProductData.filter(
      (p: any) => p.isActive === true && p.verificationStatus === "approved"
    );
  }, [allProductData]);

  return (
    <motion.div
       initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 px-4 py-16"
    >
      {/* ✅ PAGE HEADING */}
        <div className="w-[90%] mx-auto mt-10 mb-10">
        <span className="text-xs font-semibold  flex justify-center mb-5 tracking-widest text-pink-600 uppercase">
          Shop only from approved sellers with guaranteed quality
        </span>
        <div className="flex items-center  justify-center gap-2 mt-1">
          <h2 className="text-3xl md:text-5xl  font-extrabold text-gray-900">
           Explore Verified & {" "}
            <span className="bg-gradient-to-r from-pink-500  via-orange-500 to-purple-600 bg-clip-text text-transparent">
              Trending Products
            </span>
          </h2>
        </div>
      </div>

      {/* ✅ PRODUCT GRID */}
      <div className="max-w-7xl mx-auto">
        {visibleProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}