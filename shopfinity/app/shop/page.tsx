"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IUser } from "@/models/user.model";
import { motion } from "framer-motion";
import useGetAllVendors from "@/hooks/useGetAllVendors";
import { Store, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";


export default function ShopsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useGetAllVendors();

  const allVendorData: IUser[] = useSelector(
    (state: RootState) => state.vendor.allVendorData
  );

  if (!allVendorData || allVendorData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
            <Store className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-400 text-sm">No Shops Found</p>
        </div>
      </div>
    );
  }

  const statusStyles = (status: string) =>
    status === "approved"
      ? "bg-green-100 text-green-600"
      : status === "pending"
      ? "bg-amber-100 text-amber-600"
      : "bg-red-100 text-red-600";

  const navbarUser = session?.user as IUser | undefined;

  return (
    <>
      <Navbar user={navbarUser} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 px-4 pt-24 pb-16"
      >
      {/* ✅ HEADING */}
      <div className="max-w-7xl mx-auto mb-10  mt-10 text-center">
        <span className="text-xs font-bold tracking-widest text-pink-600 uppercase">
          Verified Sellers
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold mt-1">
          Explore Trusted{" "}
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Shops
          </span>
        </h1>
        <p className="text-gray-500 text-md mt-2">
          Discover verified vendors, authentic stores & their exclusive products
        </p>
      </div>

      {/* ✅ GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {allVendorData.map((vendor, i) => (
            <motion.div
              key={String(vendor._id)}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              onClick={() => router.push(`/shop-details/${vendor._id}`)}
              className="bg-white rounded-2xl p-4 cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* ✅ SHOP IMAGE */}
              <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={vendor.image || "/shop.png"}
                  alt={vendor.shopName || "Shop"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* ✅ SHOP NAME */}
              <h2 className="font-bold text-center text-gray-900 line-clamp-1">
                {vendor.shopName || "Unnamed Shop"}
              </h2>

              {/* ✅ BUSINESS ADDRESS */}
              <p className="flex items-center justify-center gap-1 text-xs text-gray-400 text-center mt-1 line-clamp-2">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {vendor.shopAddress || "No Address"}
              </p>

              {/* ✅ STATUS BADGE */}
              <div className="flex justify-center mt-3">
                <span
                  className={`text-[10px] font-semibold px-3 py-1 rounded-full capitalize ${statusStyles(
                    vendor.verificationStatus
                  )}`}
                >
                  {vendor.verificationStatus}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </motion.div>
    </>
  );
}