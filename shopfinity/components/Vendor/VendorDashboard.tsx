'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { MdDashboard } from "react-icons/md";
import { FaShoppingBag, FaBox } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import VendorDashboardPage from "./VendorDashboardPage";
import VendorOrders from "./VendorOrders";
import VendorProducts from "./VendorProducts";



export default function VendorDashboardLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // ---------------- PAGES ----------------

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <VendorDashboardPage />;
      case "orders": return <VendorOrders />;
      case "products": return <VendorProducts />;
      default: return <VendorDashboardPage />;
    }
  };

  // ---------------- MENU ----------------

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      desc: "Overview of your store",
      icon: <MdDashboard size={22} />,
    },
    {
      id: "orders",
      label: "My Orders",
      desc: "Track your incoming orders",
      icon: <FaShoppingBag size={20} />,
    },
    {
      id: "products",
      label: "My Products",
      desc: "Manage your product listings",
      icon: <FaBox size={20} />,
    },
  ];

  const activeItem = menu.find((item) => item.id === activePage);

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-orange-100 via-pink-50 to-purple-200 text-gray-800 p-6 gap-6">

      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/60 z-50">
        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          Vendor Panel
        </h1>
        <button onClick={() => setMenuOpen(true)}>
          {!menuOpen && <AiOutlineMenu size={24} className="text-gray-700" />}
        </button>
      </div>

      {/* ---------------- SIDEBAR LARGE DEVICES ---------------- */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex flex-col mt-20 w-80 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
      >
        <div className="flex items-center gap-2 mb-6 text-xs font-bold tracking-widest text-pink-600 uppercase">
          Vendor Panel
        </div>

        <div className="flex flex-col gap-3">
          {menu.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all text-left
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white shadow-md"
                      : "hover:bg-white/70 text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-purple-500"}>
                    {item.icon}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                {isActive && <HiChevronRight size={18} className="text-white" />}
              </button>
            );
          })}
        </div>

       
      </motion.div>

      {/* ---------------- MOBILE SIDEBAR (SLIDE) ---------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-80 h-full bg-white/90 backdrop-blur-xl p-6 z-50 border-r border-white/60 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase">
                Vendor Panel
              </div>
              <button onClick={() => setMenuOpen(false)}>
                <AiOutlineClose size={24} className="text-gray-700" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {menu.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all text-left
                      ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white shadow-md"
                          : "hover:bg-white/70 text-gray-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-white" : "text-purple-500"}>
                        {item.icon}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    {isActive && <HiChevronRight size={18} className="text-white" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  Signed in as
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-1">
                  Vendor
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- MAIN AREA ---------------- */}
      <div className="flex-1 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-10 lg:mt-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-pink-600 uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              Vendor / {activeItem?.label}
            </div>

            {/* Render actual page content */}
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}