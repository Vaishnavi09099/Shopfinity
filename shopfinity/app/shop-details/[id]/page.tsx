"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { IUser } from "@/models/user.model";
import { IProduct } from "@/models/product.model";
import useGetAllVendors from "@/hooks/useGetAllVendors";
import {
  MapPin,
  Clock,
  Star,
  Package,
  Truck,
  BadgeCheck,
} from "lucide-react";

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // ✅ FETCH DATA ON PAGE LOAD
  useGetAllVendors();

  const { allVendorData } = useSelector((state: RootState) => state.vendor);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "about">("products");

  // ✅ WAIT FOR REDUX DATA
  useEffect(() => {
    if (allVendorData && allVendorData.length > 0) {
      setLoading(false);
    }
  }, [allVendorData]);

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Loading shop & products...</p>
      </div>
    );
  }

  // ✅ FIND VENDOR AFTER DATA EXISTS
  const vendor: IUser | undefined = allVendorData.find(
    (v: IUser) => String(v._id) === String(id)
  );

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <p className="text-gray-500 font-medium">Vendor Not Found</p>
      </div>
    );
  }

  // ✅ SAFE PRODUCTS ACCESS
  const vendorProducts: IProduct[] = Array.isArray(vendor.vendorProducts)
    ? (vendor.vendorProducts as unknown as IProduct[])
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* ================== HERO BANNER ================== */}
      <div className="relative w-full h-60 sm:h-72 bg-gradient-to-br from-purple-300 via-fuchsia-300 to-pink-300 overflow-hidden">
        {vendor.image && (
          <Image src={vendor.image} alt="banner" fill className="object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ================== SHOP HEADER ================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative -mt-20 flex flex-col sm:flex-row sm:items-end gap-5 pb-6"
        >
          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex-shrink-0">
            <Image
              src={vendor.image || "/shop.png"}
              alt={vendor.shopName || "Shop"}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{vendor.shopName}</h1>
              {vendor.verificationStatus === "approved" && (
                <span className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {vendor.shopAddress || "No address"}
              </span>
            
            </div>
          </div>
        </motion.div>

        {/* ================== STATS ROW ================== */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 rounded-2xl p-4 mb-6"
>
  <StatCard icon={<Package className="w-4 h-4" />} value={String(vendorProducts.length)} label="Products" />
  <StatCard
    icon={<BadgeCheck className="w-4 h-4" />}
    value={vendor.verificationStatus === "approved" ? "Yes" : "No"}
    label="Verified"
  />
  <StatCard icon={<Truck className="w-4 h-4" />} value="GST" label={vendor.gstNumber ? "Provided" : "N/A"} />
</motion.div>

        {/* ================== TABS ================== */}
        <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
          {[
            { id: "products", label: "Products" },
            { id: "about", label: "About" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="shopTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 to-pink-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* ================== PRODUCTS TAB ================== */}
        {activeTab === "products" && (
          <div className="pb-16">
            {vendorProducts.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No products added by this shop yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {vendorProducts.map((product: IProduct, i: number) => (
                  <motion.div
                    key={String(product._id)}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -6 }}
                    onClick={() => router.push(`/view-product/${product._id}`)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    {/* IMAGE */}
                    <div className="relative w-full aspect-square bg-gray-50">
                      <Image src={product.image1} alt={product.title} fill className="object-cover" />

                      {product.stock <= 0 && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-gray-800 text-white px-2.5 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{product.category}</p>

                      <div className="flex items-center justify-between pt-1">
                        <p className="font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                          ₹{product.price}
                        </p>
                        <span
                          className={`text-[10px] font-semibold ${
                            product.stock > 0 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================== ABOUT TAB ================== */}
        {activeTab === "about" && (
          <div className="bg-gray-50 rounded-2xl p-8 mb-16 space-y-3">
            <h3 className="font-bold text-gray-900">About {vendor.shopName}</h3>
            <p className="text-sm text-gray-500">{vendor.shopAddress}</p>
            <p className="text-sm text-gray-500">GST: {vendor.gstNumber || "Not Provided"}</p>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                vendor.verificationStatus === "approved"
                  ? "bg-green-100 text-green-600"
                  : vendor.verificationStatus === "pending"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {vendor.verificationStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl p-3">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-extrabold text-gray-900 leading-tight">{value}</p>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);