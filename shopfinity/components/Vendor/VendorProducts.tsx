"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "@/redux/store";
import { setAllProductsData } from "@/redux/vendorSlice";

import { Plus, Pencil, AlertCircle, Search, Package, CheckCircle2, Clock } from "lucide-react";
import getAllProductsData from "@/hooks/useGetAllProducts";
import useGetMe from "@/hooks/useGetMe";

export default function VendorProducts() {
  const router = useRouter();
  const dispatch = useDispatch();
  getAllProductsData();
  useGetMe();

  const currentUser = useSelector((state: RootState) => state.user.userData);

  // ✅ FIX: allProductsData was undefined before, now pulled correctly from redux
  const { allProductData } = useSelector((state: RootState) => state.vendor);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const myProducts =
    currentUser?._id && allProductData?.length
      ? allProductData.filter(
          (product: any) =>
            product.vendor === currentUser._id ||
            product.vendor?._id === currentUser._id
        )
      : [];

  const filteredProducts = myProducts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = myProducts.length;
  const approvedCount = myProducts.filter((p: any) => p.verificationStatus === "approved").length;
  const pendingCount = myProducts.filter((p: any) => p.verificationStatus === "pending").length;

  // ✅ ENABLE / DISABLE HANDLER
  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      setLoadingId(productId);

      const res = await axios.post("/api/vendor/isActiveProduct", {
        productId,
        isActive: !currentStatus,
      });

      // ✅ Update Redux instantly
      const updatedProducts = allProductData.map((p: any) =>
        p._id === productId ? res.data.product : p
      );

      dispatch(setAllProductsData(updatedProducts));

      setLoadingId(null);
    } catch (error: any) {
      setLoadingId(null);
      alert(error?.response?.data?.message || "Status update failed ❌");
    }
  };

  const statusStyles = (status: string) =>
    status === "approved"
      ? "bg-emerald-100 text-emerald-600"
      : status === "pending"
      ? "bg-amber-100 text-amber-600"
      : "bg-red-100 text-red-600";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 p-4 sm:p-8">
      {/* ================= HEADER / HERO CARD ================= */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          Vendor / Catalog
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                My Products
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Add, review and manage every product in your store — all in one delightful place.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/addVendorProduct")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md whitespace-nowrap h-fit"
          >
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </div>

        {/* ✅ STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total</p>
              <p className="text-lg font-extrabold text-gray-800">{totalCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Approved</p>
              <p className="text-lg font-extrabold text-gray-800">{approvedCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Pending</p>
              <p className="text-lg font-extrabold text-gray-800">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your products..."
          className="w-full bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:border-pink-300 shadow-sm"
        />
      </div>

      {/* ================= PRODUCT GRID ================= */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          No Products Found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product: any) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative w-full h-44 bg-gray-100">
                <Image
                  src={product.image1}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles(
                    product.verificationStatus
                  )}`}
                >
                  {product.verificationStatus}
                </span>
              </div>

              {/* BODY */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                {product.category && (
                  <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">
                    {product.category}
                  </span>
                )}

                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-800 text-sm leading-snug">{product.title}</h2>
                  <p className="text-sm font-extrabold text-pink-600 whitespace-nowrap">₹{product.price}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                  <span>Stock {product.stock ?? "-"}</span>
                  {product.freeDelivery && <span>· Free delivery</span>}
                  {product.warranty && <span>· {product.warranty}</span>}
                </div>

                <span
                  className={`w-fit text-[11px] font-semibold mt-1 ${
                    product.isActive ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {product.isActive ? "● Active" : "● Inactive"}
                </span>

                {/* ✅ REJECT NOTE */}
                {product.verificationStatus === "rejected" && (
                  <div className="mt-1 bg-red-50 border border-red-100 text-red-500 text-[11px] p-2 rounded-xl">
                    <p className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <b>Rejected:</b> {product.rejectedReason || "No reason provided"}
                    </p>
                    <p className="mt-1 text-amber-600">
                      ✏ After edit, product will be sent for re-verification.
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-auto pt-3">
                  <button
                    onClick={() => router.push(`/updateProduct/${product._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>

                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    disabled={product.verificationStatus !== "approved" || loadingId === product._id}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                      product.verificationStatus === "approved"
                        ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loadingId === product._id ? "Updating..." : product.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}