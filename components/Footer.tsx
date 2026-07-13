"use client";
import { useRouter } from "next/navigation";

import { IUser } from "@/models/user.model";

export default function Footer({ user }: { user: IUser }) {
  const router = useRouter();

  const role = user?.role; // "shopper" | "admin" | "vendor"

  const isUser = role === "shopper";
  const isAdminOrVendor = role === "admin" || role === "vendor";

  return (
    <footer className="bg-white w-full text-gray-600 z-40 py-12  border-t border-gray-100">
      <div
        className={`max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left 
        ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}
      >
        {/* ✅ BRAND SECTION - ALL */}
        <div className="space-y-3">
          <h2
            onClick={() => router.push("/")}
            className="text-2xl font-extrabold cursor-pointer bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent tracking-wide"
          >
           Shopfinity
          </h2>

          <p className="text-sm leading-relaxed text-gray-500">
            Smart, secure & scalable multi-vendor eCommerce platform built for
            performance and growth.
          </p>

          {isAdminOrVendor && (
            <span
              className={`inline-block mt-2 text-[11px] font-semibold shadow-lg px-3 py-1 rounded-full text-white
              ${role === "admin" ? "bg-gradient-to-r from-purple-600 to-fuchsia-600" : "bg-gradient-to-r from-pink-500 to-rose-500"}`}
            >
              {role === "admin" ? "Admin Panel" : "Vendor Dashboard"}
            </span>
          )}
        </div>

        {/* ✅ QUICK LINKS - ONLY USER */}
        {isUser && (
          <div>
            <h3 className="text-gray-900 text-xs font-bold tracking-widest uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li onClick={() => router.push("/")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Home</li>
              <li onClick={() => router.push("/category")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Categories</li>
              <li onClick={() => router.push("/shop")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Shop</li>
              <li onClick={() => router.push("/contact")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Contact</li>
            </ul>
          </div>
        )}

        {/* ✅ SUPPORT - ONLY USER */}
        {isUser && (
          <div>
            <h3 className="text-gray-900 text-xs font-bold tracking-widest uppercase mb-4">
              Help & Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li onClick={() => router.push("/support")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Support</li>
              <li onClick={() => router.push("/orders")} className="cursor-pointer text-gray-500 hover:text-purple-600 transition-colors">Track Order</li>
            </ul>
          </div>
        )}

        {/* ✅ ROLE INFO + VENDOR ACTIONS */}
        {isAdminOrVendor && (
          <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-white/60">
            <h3 className="text-gray-900 text-sm font-bold mb-3">
              {role === "admin" ? "System Access" : "Vendor Dashboard"}
            </h3>

            <ul className="space-y-2 text-sm text-gray-500 mb-4">
              {role === "admin" ? (
                <>
                  <li>✔ Platform Management</li>
                  <li>✔ Vendor Control</li>
                  <li>✔ Orders & Revenue</li>
                  <li>✔ System Security</li>
                </>
              ) : (
                <>
                  <li>✔ Product Upload & Edit</li>
                  <li>✔ Order & Delivery Tracking</li>
                  <li>✔ Sales & Profit Analytics</li>
                  <li>✔ Wallet & Settlement</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* ✅ CONTACT INFO - ALL */}
        <div className="space-y-2">
          <h3 className="text-gray-900 text-xs font-bold tracking-widest uppercase mb-4">
            Contact Info
          </h3>
          <p className="text-sm text-gray-500">admin@shopfinity.com</p>
          <p className="text-sm text-gray-500">+91 XXXXX XXXXX</p>
          <p className="text-sm text-gray-500">New Delhi, India</p>
        </div>
      </div>

      {/* ✅ BOTTOM BAR */}
    <div className="flex justify-center items-center text-xs text-gray-400 mt-10 pt-5 border-t border-gray-100 ">
  © {new Date().getFullYear()} Shopfinity. All rights reserved.
</div>
    </footer>
  );
}