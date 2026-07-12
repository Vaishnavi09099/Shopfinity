"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useGetAllVendors from "@/hooks/useGetAllVendors";
import {
  Store,
  Phone,
  FileText,
  Package,
  X,
  ArrowRight,
} from "lucide-react";

type Product = {
  _id: string;
  title: string;
  price: number;
  image1: string;
  description: string;
  category: string;
  verificationStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
};

type Vendor = {
  _id: string;
  name: string;
  phone?: string;
  shopName?: string;
  gstNumber?: string;
  image?: string; // 👈 added
  verificationStatus?: "pending" | "approved" | "rejected";
  vendorProducts?: Product[];
};

export default function VendorDetails() {
  useGetAllVendors();

  const allVendorData: Vendor[] = useSelector((state: any) => state.vendor.allVendorData);

  const approvedVendors = Array.isArray(allVendorData)
    ? allVendorData.filter((v) => v.verificationStatus === "approved")
    : [];

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const statusStyles = (status?: string) =>
    status === "approved"
      ? "bg-green-100 text-green-600"
      : status === "pending"
      ? "bg-amber-100 text-amber-600"
      : "bg-red-100 text-red-600";

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        Admin / Vendors
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Approved Vendors
          </span>
        </h1>
        <span className="text-sm font-semibold text-gray-500 bg-white/70 px-4 py-2 rounded-full border border-white/60">
          {approvedVendors.length} vendors
        </span>
      </div>

      {/* ================= VENDOR CARDS ================= */}
      {approvedVendors.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          No approved vendors yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[65vh] overflow-y-auto pr-2">
          {approvedVendors.map((vendor) => (
            <motion.div
              key={vendor._id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                {vendor.image ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image src={vendor.image} alt={vendor.shopName || "vendor"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {vendor.shopName?.slice(0, 2).toUpperCase() || "??"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{vendor.shopName || "Unnamed Shop"}</p>
                  <p className="text-xs text-gray-400 truncate">{vendor.name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                  {vendor.phone || "—"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                  {vendor.gstNumber || "—"}
                </div>
              </div>

              <button
                onClick={() => setSelectedVendor(vendor)}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-full"
              >
                <Package className="w-4 h-4" /> Check Products <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= PRODUCT MODAL ================= */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-3xl w-full max-w-xl shadow-xl border border-white/60 max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {selectedVendor.image ? (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={selectedVendor.image} alt="vendor" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Products of {selectedVendor.shopName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Scrollable product list */}
              <div className="px-6 sm:px-8 py-5 overflow-y-auto flex-1">
                {selectedVendor.vendorProducts?.length ? (
                  <div className="space-y-3">
                    {selectedVendor.vendorProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                            <Image src={product.image1} alt="product" fill className="object-cover" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">{product.title}</p>
                            <p className="text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                          <p>
                            <b className="text-gray-700">Category:</b> {product.category}
                          </p>
                          <p className="line-clamp-2">
                            <b className="text-gray-700">Description:</b> {product.description}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${statusStyles(product.verificationStatus)}`}>
                              {product.verificationStatus}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                product.isActive ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 text-sm py-10">No Product Found Yet</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}